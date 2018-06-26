import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { BehaviorSubject } from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import * as io from 'socket.io-client';

import { environment } from './../../../environments/environment';
import { Box } from 'app/shared/models/box.model';

@Injectable()
export class JukeboxService {
    private connectionOptions = {
        'transports': ['websocket']
    };
    private socket = io('localhost:8008', this.connectionOptions);

    public box: Box;
    public boxSubject: BehaviorSubject<Box> = new BehaviorSubject<Box>(this.box);

    constructor(private http: Http) { }

    connect(token: string, userToken: string) {
        const observable = new Observable(observer => {
            this.socket.on('connect', () => {
                console.log('Connecting to Box socket...');
                this.socket.emit('auth', {
                    origin: 'BERRYBOX PNEUMA',
                    type: 'sync',
                    token,
                    subscriber: userToken
                });
            });

            this.socket.on('confirm', (data) => {
                console.log('connected to socket');
                observer.next(data);
                // Tells the service the user is joining. Response will be on sync
                this.socket.emit('start', {
                    token,
                    subscriber: userToken
                });
            });

            this.socket.on('sync', (data) => {
                console.log('recieved sync data', data);
                observer.next(data);
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
    getBox(): Observable<Box> {
        return this.boxSubject.asObservable();
    }

    /**
     * Sets the box in memory of the service to provide it to subscribers
     *
     * @param {Box} box
     * @memberof JukeboxService
     */
    setBox(box: Box) {
        this.box = box;
        this.sendBox();
    }

    /**
     * Sends the updated box to subscribers
     *
     * @memberof JukeboxService
     */
    sendBox() {
        this.boxSubject.next(this.box);
    }
}
