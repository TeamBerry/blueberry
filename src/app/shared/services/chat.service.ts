import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import * as io from 'socket.io-client';

import { environment } from './../../../environments/environment';

@Injectable()
export class ChatService {
    private connectionOptions = {
        'transports': ['websocket']
    };
    private socket = io('localhost:3001', this.connectionOptions);
    constructor(private http: Http) { }

    list(token: string) {
        return this.http.get(environment.apiUrl + '/box/' + token + '/chat/all')
            .map((response: Response) => {
                return response.json();
            });
    }

    post(message) {
        this.socket.emit('chat', message);
        /* return this.http.post(environment.apiUrl + '/box/' + token + '/chat', message)
            .map((response: Response) => {
                return response.json();
            }); */
    }

    put(token: string, message) {

    }

    delete(token: string, id: number) {
        return this.http.delete(environment.apiUrl + '/box/' + token + '/chat/message/' + id)
            .map((response: Response) => {
                return response.json();
            });
    }

    /**
     * Adds a subscription to the box socket, for the chat type
     *
     * @param {string} token
     * @param {string} userToken
     * @returns
     * @memberof ChatService
     */
    connect(token: string, userToken: string) {
        const observable = new Observable(observer => {
            // On connect, indicate we're here for the chat
            this.socket.on('connect', () => {
                console.log('attempting to connect to socket...');
                this.socket.emit('auth', {
                    origin: 'BERRYBOX PNEUMA',
                    type: 'chat',
                    token,
                    subscriber: userToken
                });
            });

            this.socket.on('confirm', (data) => {
                console.log('connected to socket: ', data);
                console.log(this.socket.id);
            });

            this.socket.on('denied', (data) => {
                observer.error(JSON.parse(data));
            });

            this.socket.on('chat', (data) => {
                console.log('recieved chat message', data);
                observer.next(data);
            });

            return () => {
                this.socket.disconnect();
            };
        });
        return observable;
    }
}
