import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { environment } from './../../environments/environment';

@Injectable()
export class BoxService {

    constructor(private http: Http) { }

    list() {
        return this.http.get(environment.apiUrl + '/boxes')
            .map((response: Response) => {
                return response.json();
            });
    }

    get(token: string) {
        return this.http.get(environment.apiUrl + '/boxes/' + token)
            .map((response: Response) => {
                return response.json();
            });
    }

}
