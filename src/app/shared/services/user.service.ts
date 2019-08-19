import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


import { environment } from './../../../environments/environment';

import { User } from 'app/shared/models/user.model';
import { Box } from '../models/box.model';
import { UserPlaylist } from '../models/user-playlist.model';

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
        return this.http.get<User>(environment.araza + '/user/' + token);
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
        return this.http.put<User>(environment.araza + '/user/' + token, user);
    }


    /**
     * Updates the favorites of an user
     *
     * @param {User} user
     * @returns {Observable<User>}
     * @memberof UserService
     */
    updateFavorites(user: User): Observable<User> {
        return this.http.patch<User>(environment.araza + '/user/' + user._id + '/favorites', user.favorites);
    }

    stats(token: string) { }

    /**
     * Gets all active boxes for an user
     *
     * @param {User} user
     * @returns {Observable<Array<Box>>}
     * @memberof UserService
     */
    boxes(user: User): Observable<Array<Box>> {
        return this.http.get<Array<Box>>(environment.araza + '/user/' + user._id + '/boxes');
    }

    /**
     * Gets all playlists for an user
     *
     * @param {User} user
     * @returns {Observable<Array<UserPlaylist>>}
     * @memberof UserService
     */
    playlists(user: User): Observable<Array<UserPlaylist>> {
        return this.http.get<Array<UserPlaylist>>(environment.araza + '/user/' + user._id + '/playlists');
    }
}
