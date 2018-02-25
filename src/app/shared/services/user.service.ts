import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { environment } from './../../../environments/environment';
import 'rxjs/add/operator/map';

@Injectable()
export class UserService {

    constructor(private http: Http) { }

    get(token: string) {
        return this.http.get(environment.logosUrl + '/user/' + token)
        .map((response: Response) => {
            return response.json();
        });
    }

    stats(token: string) {
        return this.http.get(environment.logosUrl + '/user/' + token + '/stats')
        .map((response: Response) => {
            return response.json();
        });
    }

    likes(token: string) {
        return this.http.get(environment.logosUrl + '/user/' + token + '/likes')
        .map((response: Response) => {
            return response.json();
        });
    }

}
