import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';

import { environment } from './../../../environments/environment';

@Injectable()
export class ChatService {
    constructor(private http: Http) { }

    list(token: string) {
        return this.http.get(environment.apiUrl + '/box/' + token + '/chat/all')
            .map((response: Response) => {
                return response.json();
            });
    }

    post(token: string, message) {
        return this.http.post(environment.apiUrl + '/box/' + token + '/chat', message)
            .map((response: Response) => {
                return response.json();
            });
    }

    put(token: string, message) {

    }

    delete(token: string, id: number) {
        return this.http.delete(environment.apiUrl + '/box/' + token + '/chat/message/' + id)
            .map((response: Response) => {
                return response.json();
            });
    }
}
