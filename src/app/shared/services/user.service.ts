import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { environment } from './../../../environments/environment';
import { User } from 'app/shared/models/user.model';

@Injectable()
export class UserService {

    constructor(
        private http: HttpClient
    ) { }

    /**
     * Gets a single user
     *
     * @param {string} token The token of the user
     * @returns {Observable<User>}
     * @memberof UserService
     */
    show(token: string): Observable<User> {
        return this.http.get<User>(environment.chronosUrl + '/user/' + token)
            .map((user: User) => {
                return new User(user);
            });
    }

    stats(token: string) { }

    likes(token: string) { }

}
