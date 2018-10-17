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
     * Gets a single user. User is served with their favorites
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

    /**
     * Updates an user
     *
     * @param {string} token The token of the user
     * @param {User} user The user to update
     * @returns {Observable<User>} The updated user
     * @memberof UserService
     */
    update(token: string, user: User): Observable<User> {
        return this.http.put<User>(environment.chronosUrl + '/user/' + token, user);
    }


    /**
     * Updates the favorites of an user
     *
     * @param {User} user
     * @returns {Observable<User>}
     * @memberof UserService
     */
    updateFavorites(user: User): Observable<User> {
        return this.http.patch<User>(environment.chronosUrl + '/user/' + user._id + '/favorites', user.favorites);
    }

    stats(token: string) { }
}
