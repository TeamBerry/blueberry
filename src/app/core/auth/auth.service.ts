import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import * as moment from 'moment';

import { environment } from 'environments/environment';

@Injectable()
export class AuthService {

    constructor(
        private http: Http
    ) { }

    /**
     * Logs the user in
     *
     * @param {string} mail
     * @param {string} password
     * @memberof AuthService
     */
    login(mail: string, password: string) {
        console.log('CONTACTING CHRONOS WITH THIS.');
        return this.http.post(environment.chronosUrl + '/auth/login', { mail: mail, password: password })
            .map((response: Response) => {
                return response.json();
            });
        /*.do(res => this.setSession)
        .shareReplay();*/
    }

    signup(mail: string, password: string){
        return this.http.post(environment.chronosUrl + '/signup', { mail: mail, password: password})
            .map((response: Response) => {
                return response.json();
            });
    }


    /**
     * Logs the user out by destroying its session
     *
     * @memberof AuthService
     */
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('expires_at');
        location.reload();
    }


    /**
     * Sets the session for the user based on the bearer token
     *
     * @public // Should be private
     * @param {*} authResult Result of the authentification process
     * @memberof AuthService
     */
    public setSession(authResult) {
        const expiresAt = moment().add(authResult.expiresIn, 'second');

        localStorage.setItem('token', authResult.bearer);
        localStorage.setItem('expires_at', JSON.stringify(expiresAt));
    }

    public isLoggedIn(){
        return moment().isBefore(this.getExpiration());
    }

    getExpiration(){
        return moment(JSON.parse(localStorage.getItem('expires_at')));
    }

}
