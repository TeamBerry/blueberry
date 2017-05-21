import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { environment } from './../../environments/environment';

@Injectable()
export class PlayerService {

    constructor(private http: Http) { }

    playlist(boxToken: string) {
        return this.http.get(environment.apiUrl + '/box/' + boxToken + '/playlist/all')
        .map((response: Response) => {
            return response.json();
        });
    }

    current(boxToken: string){
        return this.http.get(environment.apiUrl + '/box/' + boxToken + '/playlist/current')
        .map((response: Response) => {
            return response.json();
        });
    }

    next(boxToken: string){
        return this.http.get(environment.apiUrl + '/box/' + boxToken + '/playlist/next')
        .map((response: Response) => {
            return response.json();
        });
    }

    submit(boxToken: string, video){
        return this.http.post(environment.apiUrl + '/box/' + boxToken + '/playlist', video)
        .map((response: Response) => {
            return response.json();
        });
    }

    update(boxToken: string, video){
        return this.http.put(environment.apiUrl + '/box/' + boxToken + '/playlist/' + video.room_history_id, video)
        .map((response: Response) => {
            return response.json();
        });
    }

    shuffle(boxToken: string){
        return this.http.get(environment.apiUrl + '/box/' + boxToken + '/playlist/shuffle')
        .map((response: Response) => {
            return response.json();
        });
    }

    swap(boxToken: string, action){
        return this.http.post(environment.apiUrl + '/box/' + boxToken + '/playlist/swap', action)
        .map((response: Response) => {
            return response.json();
        })
    }

}
