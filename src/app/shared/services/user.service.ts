import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';


import { environment } from './../../../environments/environment';

import { User } from 'app/shared/models/user.model';
import { Box } from '../models/box.model';
import { AuthSubject } from '../models/session.model';

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
     * Gets the favorites of an user
     *
     * Needs to be cached!
     *
     * @param {*} [searchOptions={ title: undefined }]
     * @returns {Observable<User['favorites']>}
     * @memberof UserService
     */
    favorites(searchOptions = { title: undefined }): Observable<User['favorites']> {
        const options = {
            params: new HttpParams()
        }

        if (searchOptions.title) {
            options.params = options.params.set('title', searchOptions.title.toString())
        }

        return this.http.get<User['favorites']>(`${environment.araza}/user/favorites`, options)
    }

    /**
     * Updates the favorites of an user
     *
     * @param {User} user
     * @returns {Observable<User>}
     * @memberof UserService
     */
    updateFavorites(command: { action: 'like' | 'unlike', target: string }): Observable<User> {
        return this.http.post<User>(`${environment.araza}/user/favorites`, command);
    }

    /**
     * Update user settings
     *
     * @param {*} settings
     * @returns
     * @memberof UserService
     */
    updateSettings(settings) {
        return this.http.patch(`${environment.araza}/user/settings`, settings);
    }

    stats(token: string) { }

    /**
     * Gets all active boxes for an user
     *
     * @param {User} user
     * @returns {Observable<Array<Box>>}
     * @memberof UserService
     */
    boxes(user: AuthSubject): Observable<Array<Box>> {
        return this.http.get<Array<Box>>(environment.araza + '/user/' + user._id + '/boxes');
    }

    /**
     * Uploads the profile picture of the user to the database
     *
     * @param {FormData} picture
     * @param {AuthSubject} user
     * @returns {Observable<string>} The name of the file
     * @memberof UserService
     */
    uploadPicture(picture: FormData, user: AuthSubject): Observable<{ file: string }> {
        return this.http.post<{ file: string }>(`${environment.araza}/users/${user._id}/picture`, picture)
    }
}
