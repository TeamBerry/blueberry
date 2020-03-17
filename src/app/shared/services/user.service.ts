import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';


import { environment } from './../../../environments/environment';

import { User } from 'app/shared/models/user.model';
import { Box } from '../models/box.model';
import { AuthSubject } from '../models/session.model';
import { shareReplay } from 'rxjs/operators';
import { UserPlaylist } from '../models/user-playlist.model';
import { Video } from '../models/video.model';

@Injectable()
export class UserService {
    public favorites$: Observable<User['favorites']> = null;

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
     * @param {boolean} [refresh=false]
     * @returns {Observable<User['favorites']>}
     * @memberof UserService
     */
    favorites(refresh = false): Observable<User['favorites']> {
        if (refresh === true || this.favorites$ === null) {
            this.favorites$ = null;
        }

        if (!this.favorites$) {
            this.favorites$ = this.http
                .get<User['favorites']>(`${environment.araza}/user/favorites`)
                .pipe(shareReplay(1));
        }

        return this.favorites$;
    }

    /**
     * Updates the favorites of an user. Will refresh favorites and send them back.
     *
     * @param {User} user
     * @returns {Observable<User>}
     * @memberof UserService
     */
    updateFavorites(command: { action: 'like' | 'unlike', target: string }): Observable<User['favorites']> {
        this.http.post<User>(`${environment.araza}/user/favorites`, command).subscribe();
        this.favorites$ = null;
        return this.favorites(true);
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
     * Gets all playlists for an user
     *
     * @param {User} user
     * @returns {Observable<Array<UserPlaylist>>}
     * @memberof UserService
     */
    playlists(user: AuthSubject): Observable<Array<UserPlaylist>> {
        return this.http.get<Array<UserPlaylist>>(environment.araza + '/user/' + user._id + '/playlists');
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
