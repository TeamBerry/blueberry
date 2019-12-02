import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';

import io from 'socket.io-client';
import * as _ from 'lodash';

import { environment } from './../../../environments/environment';
import { Box } from 'app/shared/models/box.model';
import { Message } from 'app/shared/models/message.model';
import { SyncPacket } from 'app/shared/models/sync-packet.model';
import { SubmissionPayload, CancelPayload } from 'app/shared/models/playlist-payload.model';
import { AuthService } from 'app/core/auth/auth.service';
import { User } from 'app/shared/models/user.model';
import { AuthSubject } from 'app/shared/models/session.model';

@Injectable({
    providedIn: 'root'
})
export class JukeboxService {
    private boxSocket;

    /**
     * Replay Subject for components that need to connect to the box stream. The Jukebox Service will connect
     * itself to the server sockets and relay the stream through this Subject. That way, it can inject data
     * in the stream for components. Acts as a middleware.
     *
     * @private
     * @type {ReplaySubject<any>}
     * @memberof JukeboxService
     */
    private boxStream: ReplaySubject<Box | Message | SyncPacket> = new ReplaySubject<Box | Message | SyncPacket>();

    /**
     * Subject for every component in the box that will need to do stuff based on the actions of other components.
     * They Jukebox Service provides a stream so all components can tell each other they're doing stuff.
     *
     * Example: A favorite has been removed by the favoritelist component. An order to refresh favorites across the whole
     * ecosystem is sent. The moodwidget might want to check if the video currently playing is still in favorites.
     *
     * @private
     * @type {Subject<string>}
     * @memberof JukeboxService
     */
    private orderStream: Subject<string> = new Subject<string>();

    public box: Box;

    // TODO: Refactor this into the stream
    public boxSubject: BehaviorSubject<Box> = new BehaviorSubject<Box>(this.box);

    public user: AuthSubject = AuthService.getAuthSubject();

    constructor() {
    }

    /**
     * Sets the box in memory of the service to provide it to subscribers
     *
     * @param {Box} box
     * @memberof JukeboxService
     */
    public startBox(box: Box) {
        this.box = box;

        // Connect to socket.
        this.startBoxSocket(box._id, this.user._id).subscribe(
            (message) => {
                this.boxStream.next(message);
            },
            error => {
                console.error(error);
            }
        );

        this.sendBox();
    }

    public getBoxStream(): Observable<any> {
        return this.boxStream.asObservable();
    }

    public getOrderStream(): Observable<string> {
        return this.orderStream.asObservable();
    }

    /**
     * Returns the observable of the box for any component who needs it
     *
     * @returns {Observable<Box>}
     * @memberof JukeboxService
     */
    public getBox(): Observable<Box> {
        return this.boxSubject.asObservable();
    }

    /**
     * Submits a video to the playlist of the box
     *
     * @param {SubmissionPayload} video The video to submit. Structure goes as follows:
     * @memberof JukeboxService
     */
    public submitVideo(video: SubmissionPayload): void {
        this.boxSocket.emit('video', video);
    }

    /**
     * Cancels a video from the playlist
     *
     * @param {*} cancelPayload
     * @memberof JukeboxService
     */
    public cancelVideo(cancelPayload: CancelPayload): void {
        this.boxSocket.emit('cancel', cancelPayload)
    }

    /**
     * Skips the currently playing video.
     *
     * @see JukeboxService.next
     * @memberof JukeboxService
     */
    public skipVideo() {
        if (this.evaluateCommandPower()) {
            this.next();
        }
        this.next();
    }

    // TODO: The following 3
    public shuffle() {

    }

    public swap() {

    }

    public toggle() {

    }

    public next(): void {
        this.boxSocket.emit('sync', {
            order: 'next',
            boxToken: this.box._id
        });
    }

    /**
     * Sends a message to the socket
     *
     * @param {Message} message The message to send
     * @memberof JukeboxService
     */
    public postMessageToSocket(message: Message): void {
        this.boxSocket.emit('chat', message);
    }

    /**
     * Allows components to send messages via the box stream
     *
     * @param {Message} message The message to dispatch
     * @memberof JukeboxService
     */
    public postMessageToStream(message: Message): void {
        this.boxStream.next(message);
    }

    // ORDERS
    public sendOrder(order: string) {
        this.emitOrder(order)
    }

    protected emitOrder(order) {
        this.orderStream.next(order)
    }

    /**
     * Sends the updated box to subscribers
     *
     * @memberof JukeboxService
     */
    protected sendBox() {
        this.boxSubject.next(this.box);
    }

    /**
     * Connects to the box socket and start real-time stuff
     *
     * @private Will connect itself to the socket and relay sync packets through the syncStream ReplaySubject
     * @param {string} boxToken The document ID (_id) of the box
     * @param {string} userToken The document ID (_id) of the user
     * @returns
     * @memberof JukeboxService
     */
    private startBoxSocket(boxToken: string, userToken: string) {
        this.boxSocket = io(environment.boquila, { transports: ['websocket'] });

        return new Observable<Message | SyncPacket | Box>(observer => {
            this.boxSocket.on('connect', () => {
                this.boxSocket.emit('auth', {
                    origin: 'BERRYBOX PNEUMA',
                    type: 'sync',
                    boxToken,
                    userToken
                });
            });

            this.boxSocket.on('confirm', (feedback: Message) => {
                observer.next(new Message(feedback));
                // Tells the service the user is joining. Response will be on sync
                this.boxSocket.emit('start', {
                    boxToken,
                    userToken
                });
            });

            this.boxSocket.on('denied', (feedback) => {
                observer.error(JSON.parse(feedback));
                // TODO: Add feedback in the chat
            })

            this.boxSocket.on('sync', (syncPacket: SyncPacket) => {
                if (syncPacket.box === this.box._id) {
                    observer.next(new SyncPacket(syncPacket));
                }
            });

            this.boxSocket.on('next', (box: Box) => {
                if (box._id === this.box._id) {
                    this.sendBox();
                }
            });

            // When the refreshed box is sent by Tamarillo, it is sent to every components that needs it
            this.boxSocket.on('box', (updatedBox: Box) => {
                if (updatedBox._id === this.box._id) {
                    this.box = updatedBox;
                    this.sendBox();
                }
            });

            // On chat. Regular event.
            this.boxSocket.on('chat', (feedback: Message) => {
                if (feedback.scope === this.box._id) {
                    observer.next(new Message(feedback));
                }
            });

            return () => {
                this.boxSocket.disconnect();
            };
        });
    }

    /**
     * Evaluates whether of not the user can execute a command
     *
     * @private
     * @returns {boolean}
     * @memberof JukeboxService
     */
    public evaluateCommandPower(): boolean {
        // Send error if the user doing this is not the creator
        const creator = this.box.creator['_id'] || this.box.creator;
        if (this.user._id !== creator) {
            const message: Message = new Message({
                contents: 'You do not have the power to execute this action.',
                source: 'system',
                scope: this.box._id,
                time: new Date()
            });
            this.boxStream.next(message);
            return false;
        }
        return true
    }
}
