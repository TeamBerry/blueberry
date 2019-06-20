import { Injectable } from '@angular/core';
import { HttpClient } from '../../../../node_modules/@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { environment } from 'environments/environment';

import { User } from 'app/shared/models/user.model';

@Injectable()
export class AuthService {
    user: User;
    public subject: BehaviorSubject<User> = new BehaviorSubject<User>(this.user);

    static getSession(): User {
        const user = JSON.parse(localStorage.getItem('BBOX-user'));
        return user ? new User(user) : null;
    }

    constructor(
        private http: HttpClient,
    ) { }

    /**
     * Logs the user in
     *
     * @param {string} mail
     * @param {string} password
     * @memberof AuthService
     */
    login(mail: string, password: string) {
        return this.http.post(environment.athenaUrl + '/auth/login', { mail: mail, password: password });
    }

    showConnectedUser(token: string): Observable<User> {
        return this.http.get<User>(environment.athenaUrl + '/user/' + token);
    }

    signup(mail: string, password: string, username: string) {
        return this.http.post(environment.athenaUrl + '/auth/signup', { mail, password, username });
    }

    /**
     * Logs the user out by destroying its session
     *
     * @memberof AuthService
     */
    logout() {
        localStorage.removeItem('BBOX-token');
        localStorage.removeItem('BBOX-expires_at');
        localStorage.removeItem('BBOX-user');
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

        localStorage.setItem('BBOX-token', authResult.bearer);
        localStorage.setItem('BBOX-expires_at', JSON.stringify(expiresAt));
        localStorage.setItem('BBOX-user', JSON.stringify(authResult.subject));

        this.user = authResult.subject;
    }

    public getSession() {
        return localStorage.getItem('BBOX-token');
    }

    public isLoggedIn(): boolean {
        return moment().isBefore(this.getExpiration());
    }

    getExpiration() {
        return moment(JSON.parse(localStorage.getItem('BBOX-expires_at')));
    }

    /**
     * Below are user subscription methods for all components in the application.
     */

    public getUser(): Observable<User> {
        if (!this.user) {
            this.user = JSON.parse(localStorage.getItem('BBOX-user'));
            this.sendUser();
        }
        return this.subject.asObservable();
    }

    public setUser(user: User) {
        this.user = user;

        localStorage.setItem('BBOX-user', JSON.stringify(user));

        this.sendUser();
    }

    public sendUser() {
        this.subject.next(this.user);
    }

}
