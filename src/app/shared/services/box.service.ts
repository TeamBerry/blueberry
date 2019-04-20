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
        return this.http.get<Box[]>(environment.chronosUrl + '/box');
    }


    /**
     * Gets one box
     *
     * @param {string} id The unique token of the box
     * @returns {Observable<Box>}
     * @memberof BoxService
     */
    show(id: string): Observable<Box> {
        return this.http.get<Box>(environment.chronosUrl + '/box/' + id);
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
        return this.http.post<Box>(environment.chronosUrl + '/box', box);
    }
}