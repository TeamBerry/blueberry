import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import * as io from 'socket.io-client';

import { Message } from 'app/shared/models/message.model';
import { environment } from 'environments/environment';

@Injectable()
export class ChatService {
    private connectionOptions = {
        'transports': ['websocket']
    };
    private socket;

    constructor() {
        // FIXME: Works fine but sends two requests. And if put in the observable, won't be reachable by other methods...
        this.socket = io(environment.hermesUrl, this.connectionOptions);
    }

    /**
     * Adds a subscription to the box socket, for the chat type
     *
     * @param {string} boxToken The document ID of the box
     * @param {string} userToken The document ID of the user
     * @returns
     * @memberof ChatService
     */
    connect(boxToken: string, userToken: string) {
        const observable = new Observable((observer) => {
            // On connect, indicate we're here for the chat
            this.socket.on('connect', () => {
                this.socket.emit('auth', {
                    origin: 'BERRYBOX PNEUMA',
                    type: 'chat',
                    boxToken,
                    userToken
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
