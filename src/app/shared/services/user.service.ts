import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';


import { environment } from './../../../environments/environment';

import { User } from 'app/shared/models/user.model';
import { Box } from '../models/box.model';
import { AuthSubject } from '../models/session.model';
import { UserPlaylist } from '../models/user-playlist.model';

@Injectable()
export class UserService {
    constructor(
        private http: HttpClient
    ) { }

    /**
     * Gets the active user
     *
     * @param token The token of the user
     * @returns
     * @memberof UserService
     */
    show(token: string): Observable<User> {
        return this.http.get<User>(`${environment.araza}/user/me`);
    }

    /**
     * Updates an user
     *
     * @param token The token of the user
     * @param user The user to update
     * @returns The updated user
     * @memberof UserService
     */
    update(token: string, user: User): Observable<User> {
        return this.http.put<User>(environment.araza + '/user/' + token, user);
    }

    /**
     * Update user settings
     *
     * @param settings
     * @returns
     * @memberof UserService
     */
    updateSettings(settings: Partial<User['settings']>) {
        return this.http.patch(`${environment.araza}/user/settings`, settings);
    }

    /**
     * Updates the default ACL config tof the user
     *
     * @param aclConfig
     * @returns
     * @memberof UserService
     */
    updateACL(aclConfig: User['acl']): Observable<User['acl']> {
        return this.http.patch<User['acl']>(`${environment.araza}/user/acl`, aclConfig);
    }

    stats(token: string) { }

    /**
     * Gets all active boxes for an user
     *
     * @param user
     * @returns
     * @memberof UserService
     */
    boxes(user: AuthSubject): Observable<Array<Box>> {
        return this.http.get<Array<Box>>(environment.araza + '/user/' + user._id + '/boxes');
    }

    /**
     * Gets all playlists for an user
     *
     * @param user
     * @returns
     * @memberof UserService
     */
    playlists(user: AuthSubject): Observable<Array<UserPlaylist>> {
        return this.http.get<Array<UserPlaylist>>(environment.araza + '/user/' + user._id + '/playlists');
    }

    /**
     * Uploads the profile picture of the user to the database
     *
     * @param picture
     * @param user
     * @returns The name of the file
     * @memberof UserService
     */
    uploadPicture(picture: FormData, user: AuthSubject): Observable<{ file: string }> {
        return this.http.post<{ file: string }>(`${environment.araza}/user/picture`, picture)
    }

    /**
     * Deletes the profile picture of the user
     *
     * @param user
     * @returns
     * @memberof UserService
     */
    deletePicture(): Observable<{ file: string }> {
        return this.http.delete<{ file: string }>(`${environment.araza}/user/picture`)
    }
}
