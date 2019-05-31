import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import * as _ from 'lodash';

import { environment } from './../../../environments/environment';
import { Box } from './../models/box.model';

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
        return this.http.get<Box[]>(environment.athenaUrl + '/box');
    }


    /**
     * Gets one box
     *
     * @param {string} id The unique token of the box
     * @returns {Observable<Box>}
     * @memberof BoxService
     */
    show(id: string): Observable<Box> {
        return this.http.get<Box>(environment.athenaUrl + '/box/' + id);
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
        return this.http.post<Box>(environment.athenaUrl + '/box', box);
    }

    /**
     * Updates a box in the database
     *
     * @param {Box} box
     * @returns {Observable<Box>}
     * @memberof BoxService
     */
    update(box: Box): Observable<Box> {
        return this.http.put<Box>(environment.athenaUrl + '/box/' + box._id, box);
    }

    /**
     * Closes a box.
     *
     * @param {Box} box The box to close
     * @returns {Observable<Box>} The closed box
     * @memberof BoxService
     */
    close(box: Box): Observable<Box> {
        return this.http.post<Box>(environment.athenaUrl + '/box/' + box._id + '/close', null);
    }
}
