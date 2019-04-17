import { Injectable } from '@angular/core';
import { BehaviorSubject ,  Observable } from 'rxjs';

import * as io from 'socket.io-client';
import * as _ from 'lodash';

import { environment } from './../../../environments/environment';
import { Box } from 'app/shared/models/box.model';

@Injectable()
export class JukeboxService {
    private connectionOptions = {
        'transports': ['websocket']
    };
    private socket;

    public box: Box;
    public boxSubject: BehaviorSubject<Box> = new BehaviorSubject<Box>(this.box);

    constructor() {
        // FIXME: Can't access hermes
        this.socket = io(environment.hermesUrl, this.connectionOptions);
    }

    /**
     * Connects to the box socket and start real-time stuff
     *
     * @param {string} boxToken The document ID (_id) of the box
     * @param {string} userToken The document ID (_id) of the user
     * @returns
     * @memberof JukeboxService
     */
    connect(boxToken: string, userToken: string) {
        const observable = new Observable(observer => {
            console.log('attempting to connect to socket', this.socket);
            this.socket.on('connect', () => {
                console.log('Connecting to Box socket...');
                this.socket.emit('auth', {
                    origin: 'BERRYBOX PNEUMA',
                    type: 'sync',
                    boxToken,
                    userToken
                });
            });

            this.socket.on('confirm', (data) => {
                console.log('connected to socket');
                observer.next(data);
                // Tells the service the user is joining. Response will be on sync
                this.socket.emit('start', {
                    boxToken,
                    userToken
                });
            });

            this.socket.on('denied', (data) => {
                console.log('your connection attempt has been denied.');
                observer.error(JSON.parse(data));
            })

            this.socket.on('sync', (data) => {
                console.log('recieved sync data', data);
                observer.next(data);
            });

            this.socket.on('next', (box: Box) => {
                console.log('order to go to next video', box);
                this.setBox(box);
                /* observer.next(data); */
            });

            // When the refreshed box is sent by Chronos, it is sent to every components that needs it
            this.socket.on('box', (box: Box) => {
                console.log('recieved refreshed box data', box);
                this.setBox(box);
            });

            return () => {
                this.socket.disconnect();
            };
        });
        return observable;
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
     * @param {*} video The video to submit. Structure goes as follows:
     * {
     *  "link": video code
     *  "userToken": document ID of the user submitting the video
     *  "boxToken": document ID of the box
     * }
     * @memberof JukeboxService
     */
    public submitVideo(video): void {
        this.socket.emit('video', video);
    }

    // TODO: The following 4
    public skip() {

    }

    public shuffle() {

    }

    public swap() {

    }

    public toggle() {

    }

    public next(): void {
        this.socket.emit('sync', {
            order: 'next',
            boxToken: this.box._id
        });
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
