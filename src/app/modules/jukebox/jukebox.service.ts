import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Observer, Subject, ReplaySubject } from 'rxjs';

import io from 'socket.io-client';
import * as _ from 'lodash';

import { environment } from './../../../environments/environment';
import { Box } from 'app/shared/models/box.model';
import { Message } from 'app/shared/models/message.model';
import { SyncPacket } from 'app/shared/models/sync-packet.model';
import { VideoPayload } from 'app/shared/models/video-payload.model';
import { AuthService } from 'app/core/auth/auth.service';
import { User } from 'app/shared/models/user.model';

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
    private boxStream: ReplaySubject<any> = new ReplaySubject<any>();

    public box: Box;
    public boxSubject: BehaviorSubject<Box> = new BehaviorSubject<Box>(this.box);

    public user: User = AuthService.getSession();

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

        // Connect to sync.
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
     * @param {VideoPayload} video The video to submit. Structure goes as follows:
     * @memberof JukeboxService
     */
    public submitVideo(video: VideoPayload): void {
        this.boxSocket.emit('video', video);
    }

    /**
     * Skips the currently playing video.
     *
     * @see JukeboxService.next
     * @memberof JukeboxService
     */
    public skipVideo() {
        // Send error if the user doing this is not the creator
        const creator = this.box.creator['_id'] || this.box.creator;
        if (this.user._id !== creator) {
            const message: Message = new Message({
                contents: 'You do not have the power to skip videos.',
                source: 'system',
                scope: this.box._id,
                time: new Date()
            });
            this.boxStream.next(message);
            return;
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
    public post(message: Message): void {
        this.boxSocket.emit('chat', message);
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
        console.log('Creating socket observable...');
        this.boxSocket = io(environment.hermesUrl, { transports: ['websocket'] });

        return new Observable(observer => {
            this.boxSocket.on('connect', () => {
                this.boxSocket.emit('auth', {
                    origin: 'BERRYBOX PNEUMA',
                    type: 'sync',
                    boxToken,
                    userToken
                });
            });

            this.boxSocket.on('confirm', (feedback: Message) => {
                console.log('Connected to sync socket', feedback);
                observer.next(new Message(feedback));
                // Tells the service the user is joining. Response will be on sync
                this.boxSocket.emit('start', {
                    boxToken,
                    userToken
                });
            });

            this.boxSocket.on('denied', (data) => {
                console.log('your connection attempt has been denied.');
                observer.error(JSON.parse(data));
            })

            this.boxSocket.on('sync', (syncPacket: SyncPacket) => {
                if (syncPacket.box === this.box._id) {
                    console.log('recieved sync data', syncPacket);
                    observer.next(syncPacket.item);
                }
            });

            this.boxSocket.on('next', (box: Box) => {
                if (box._id === this.box._id) {
                    console.log('order to go to next video', box);
                    this.sendBox();
                }
            });

            // When the refreshed box is sent by Chronos, it is sent to every components that needs it
            this.boxSocket.on('box', (box: Box) => {
                if (box._id === this.box._id) {
                    console.log('recieved refreshed box data', box);
                    this.box = box;
                    this.sendBox();
                }
            });

            // On chat. Regular event.
            this.boxSocket.on('chat', (feedback: Message) => {
                console.log('FEEDBACK: ', feedback);
                if (feedback.scope === this.box._id) {
                    console.log('Recieved chat message', feedback);
                    observer.next(new Message(feedback));
                }
            });

            return () => {
                this.boxSocket.disconnect();
            };
        });
    }
}
