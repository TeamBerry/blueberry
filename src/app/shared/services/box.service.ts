import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import * as _ from 'lodash';

import { environment } from './../../../environments/environment';
import { Box } from './../models/box.model';
import { UserPlaylist } from '../models/user-playlist.model';
import { ActiveSubscriber } from '@teamberry/muscadine';

@Injectable()
export class BoxService {

    constructor(
        private http: HttpClient
    ) { }


    /**
     * Gets all boxes
     *
     * @returns {Observable<Box[]>}
     * @memberof BoxService
     */
    index(): Observable<Box[]> {
        return this.http.get<Box[]>(environment.araza + '/box');
    }


    /**
     * Gets one box
     *
     * @param {string} id The unique token of the box
     * @returns {Observable<Box>}
     * @memberof BoxService
     */
    show(id: string): Observable<Box> {
        return this.http.get<Box>(environment.araza + '/box/' + id);
    }


    /**
     * Stores a new box in the database
     *
     * @param {Box} box
     * @returns {Observable<Box>}
     * @memberof BoxService
     */
    store(box: Box): Observable<Box> {
        // Omitting the _id so mongo can send it correctly created
        box = _.omit(box, '_id');
        return this.http.post<Box>(environment.araza + '/box', box);
    }

    /**
     * Updates a box in the database
     *
     * @param {Box} box
     * @returns {Observable<Box>}
     * @memberof BoxService
     */
    update(box: Box): Observable<Box> {
        return this.http.put<Box>(environment.araza + '/box/' + box._id, box);
    }

    /**
     * Deletes a box
     *
     * @param {string} id The Mongo ObjectId of the box
     * @returns {Observable<Box>}
     * @memberof BoxService
     */
    delete(id: string): Observable<Box> {
        return this.http.delete<Box>(environment.araza + '/box/' + id);
    }

    /**
     * Closes a box.
     *
     * @param {Box} box The box to close
     * @returns {Observable<Box>} The closed box
     * @memberof BoxService
     */
    close(box: Box): Observable<Box> {
        return this.http.post<Box>(environment.araza + '/box/' + box._id + '/close', null);
    }

    /**
     * Opens a box
     *
     * @param {Box} box The box to close
     * @returns {Observable<Box>} The opened box
     * @memberof BoxService
     */
    open(box: Box): Observable<Box> {
        return this.http.post<Box>(environment.araza + '/box/' + box._id + '/open', null);
    }

    convert(sourceBox: string, targetPlaylist: string) {
        return this.http.post<UserPlaylist>(
            `${environment.araza}/box/${sourceBox}/convert`,
            {
                _id: targetPlaylist
            }
        )
    }

    /**
     * Lists the users currently connected to the box
     *
     * @param {string} box
     * @returns {Observable<Array<ActiveSubscriber>>}
     * @memberof JukeboxService
     */
    public users(box: string): Observable<Array<ActiveSubscriber>> {
        return this.http.get<Array<ActiveSubscriber>>(`${environment.araza}/box/${box}/users`)
    }
}
