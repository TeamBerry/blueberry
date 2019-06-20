import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import io from 'socket.io-client';
import * as _ from 'lodash';

import { environment } from './../../../environments/environment';
import { Box } from 'app/shared/models/box.model';
import { Message } from 'app/shared/models/message.model';
import { SyncPacket } from 'app/shared/models/sync-packet.model';
import { VideoPayload } from 'app/shared/models/video-payload.model';

@Injectable()
export class JukeboxService {
    private syncSocket;
    private chatSocket;

    public box: Box;
    public boxSubject: BehaviorSubject<Box> = new BehaviorSubject<Box>(this.box);

    constructor() {
        console.log('INIT SOCKETS', this.syncSocket);
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
                    this.setBox(box);
                }
                /* observer.next(data); */
            });

            // When the refreshed box is sent by Chronos, it is sent to every components that needs it
            this.syncSocket.on('box', (box: Box) => {
                if (box._id === this.box._id) {
                    console.log('recieved refreshed box data', box);
                    this.setBox(box);
                }
            });

            return () => {
                this.syncSocket.disconnect();
            };
        });
    }

    /**
     * Adds a subscription to the box socket, for the chat type
     *
     * @param {string} boxToken The document ID of the box
     * @param {string} userToken The document ID of the user
     * @memberof JukeboxService
     */
    connectToChat(boxToken: string, userToken: string) {
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

            this.chatSocket.on('confirm', (data: Message) => {
                if (data.scope === this.box._id) {
                    console.log('Connected to chat socket.', data);
                    observer.next(new Message(data));
                }
            });

            this.chatSocket.on('denied', (data: Message) => {
                observer.error(new Message(data));
            });

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
     * Sets the box in memory of the service to provide it to subscribers
     *
     * @param {Box} box
     * @memberof JukeboxService
     */
    public setBox(box: Box) {
        this.box = box;
        this.sendBox();
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
        console.log(this.chatSocket);
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
}
