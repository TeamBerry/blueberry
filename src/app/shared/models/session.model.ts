import { Injectable } from '@angular/core';

export interface Session {
    bearer: string,
    subject: AuthSubject,
    expiresIn: number | string
}

@Injectable()
export class AuthSubject {
    _id: string;
    name: string;
    settings: {
        theme: 'light' | 'dark'
    }

    constructor(session?: Partial<AuthSubject>) {
        this._id = session && session._id || null;
        this.name = session && session.name || null;
        this.settings = session && session.settings || {
            theme: 'light'
        }
    }
};
