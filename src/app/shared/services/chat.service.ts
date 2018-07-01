import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import * as io from 'socket.io-client';

import { environment } from './../../../environments/environment';
import { Message } from 'app/shared/models/message.model';

@Injectable()
export class ChatService {
    private connectionOptions = {
        'transports': ['websocket']
    };
    private socket = io('localhost:8008', this.connectionOptions);

    constructor(private http: Http) { }

    /**
     * Adds a subscription to the box socket, for the chat type
     *
     * @param {string} boxToken
     * @param {string} userToken
     * @returns
     * @memberof ChatService
     */
    connect(boxToken: string, userToken: string) {
        const observable = new Observable(observer => {
            // On connect, indicate we're here for the chat
            this.socket.on('connect', () => {
                this.socket.emit('auth', {
                    origin: 'BERRYBOX PNEUMA',
                    type: 'chat',
                    token: boxToken,
                    subscriber: userToken
                });
            });

            this.socket.on('confirm', (data) => {
                observer.next(new Message(data));
            });

            this.socket.on('denied', (data) => {
                observer.error(JSON.parse(data));
            });

            this.socket.on('chat', (data) => {
                observer.next(new Message(data));
            });

            return () => {
                this.socket.disconnect();
            };
        });
        return observable;
    }

    /**
     * Sends a message to the socket.
     *
     * @param {Message} message
     * @memberof ChatService
     */
    post(message: Message): void {
        this.socket.emit('chat', message);
    }

}
