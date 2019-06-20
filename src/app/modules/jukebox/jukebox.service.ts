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

@Injectable()
export class JukeboxService {
    private syncSocket;
    private chatSocket;

    /**
     * Replay Subject for components that need to connect to the chat stream. The Jukebox Service will connect
     * itself to the server sockets and relay the stream through this Subject. That way, it can inject data
     * in the stream for components. Acts as a middleware.
     *
     * @private
     * @type {ReplaySubject<Message>}
     * @memberof JukeboxService
     */
    private chatStream: ReplaySubject<Message> = new ReplaySubject<Message>(5);

    public box: Box;
    public boxSubject: BehaviorSubject<Box> = new BehaviorSubject<Box>(this.box);

    public user: User = AuthService.getSession();

    constructor() {
        console.log('INIT SOCKETS', this.syncSocket);
    }

    /**
     * Sets the box in memory of the service to provide it to subscribers
     *
     * @param {Box} box
     * @memberof JukeboxService
     */
    public startBox(box: Box) {
        this.box = box;

        // Connect to chat. Components that interface with the service should use the getChatStream() method
        this.connectToChat(box._id, this.user._id).subscribe(
            (message: Message) => {
                this.chatStream.next(new Message(message));
            },
            error => {
                console.error(error);
            }
        );
        this.sendBox();
    }

    /**
     * Connects to the box socket and start real-time stuff
     *
     * @param {string} boxToken The document ID (_id) of the box
     * @param {string} userToken The document ID (_id) of the user
     * @returns
     * @memberof JukeboxService
     */
    connectToBox(boxToken: string, userToken: string) {
        console.log('Creating box socket observable...');
        this.syncSocket = io(environment.hermesUrl, { transports: ['websocket'] });
        return new Observable(observer => {
            this.syncSocket.on('connect', () => {
                console.log('Connecting to Box socket...');
                this.syncSocket.emit('auth', {
                    origin: 'BERRYBOX PNEUMA',
                    type: 'sync',
                    boxToken,
                    userToken
                });
            });

            this.syncSocket.on('confirm', (data) => {
                console.log('Connected to box socket');
                observer.next(data);
                // Tells the service the user is joining. Response will be on sync
                this.syncSocket.emit('start', {
                    boxToken,
                    userToken
                });
            });

            this.syncSocket.on('denied', (data) => {
                console.log('your connection attempt has been denied.');
                observer.error(JSON.parse(data));
            })

            this.syncSocket.on('sync', (data: SyncPacket) => {
                if (data.box === this.box._id) {
                    console.log('recieved sync data', data);
                    observer.next(data.item);
                }
            });

            this.syncSocket.on('next', (box: Box) => {
                if (box._id === this.box._id) {
                    console.log('order to go to next video', box);
                    this.startBox(box);
                }
                /* observer.next(data); */
            });

            // When the refreshed box is sent by Chronos, it is sent to every components that needs it
            this.syncSocket.on('box', (box: Box) => {
                if (box._id === this.box._id) {
                    console.log('recieved refreshed box data', box);
                    this.startBox(box);
                }
            });

            return () => {
                this.syncSocket.disconnect();
            };
        });
    }

    /**
     * Access point for other components to consume the stream of data related to messages.
     *
     * @returns {Observable<Message>}
     * @memberof JukeboxService
     */
    public getChatStream(): Observable<Message> {
        return this.chatStream.asObservable();
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
        this.syncSocket.emit('video', video);
    }

    /**
     * Skips the currently playing video.
     *
     * @see JukeboxService.next
     * @memberof JukeboxService
     */
    public skipVideo() {
        if (this.user._id !== this.box.creator['_id']) {
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
        this.syncSocket.emit('sync', {
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
        this.chatSocket.emit('chat', message);
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
     * Adds a subscription to the box socket, for the chat type.
     *
     * @private Will connect itself to the socket and relay messages through the chatStream ReplaySubject.
     * @param {string} boxToken The document ID of the box
     * @param {string} userToken The document ID of the user
     * @memberof JukeboxService
     */
    private connectToChat(boxToken: string, userToken: string): Observable<unknown> {
        this.chatSocket = io(environment.hermesUrl, { transports: ['websocket'] });
        return new Observable((observer) => {
            // On connect, indicate we're here for the chat
            this.chatSocket.on('connect', () => {
                this.chatSocket.emit('auth', {
                    origin: 'BERRYBOX PNEUMA',
                    type: 'chat',
                    boxToken,
                    userToken
                });
            });

            // On successful connexion
            this.chatSocket.on('confirm', (data: Message) => {
                if (data.scope === this.box._id) {
                    console.log('Connected to chat socket.', data);
                    observer.next(new Message(data));
                }
            });

            // On refused connexion
            this.chatSocket.on('denied', (data: Message) => {
                observer.error(new Message(data));
            });

            // On chat. Regular event.
            this.chatSocket.on('chat', (data: Message) => {
                if (data.scope === this.box._id) {
                    console.log('Recieved chat message', data);
                    observer.next(new Message(data));
                }
            });

            return () => {
                this.chatSocket.disconnect();
            };
        });
    }
}
