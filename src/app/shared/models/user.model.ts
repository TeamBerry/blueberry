import { Injectable } from "@angular/core";

@Injectable()
export class User {
    _id: string;
    name: string;
    token: string;
    mail: string;
    settings: {
        theme: 'light' | 'dark'
    };
    favorites: any[];

    constructor(user?: Partial<User>) {
        this._id = user && user._id || null;
        this.name = user && user.name || null;
        this.token = user && user.token || null;
        this.mail = user && user.mail || null;
        this.settings = user && user.settings || {
            theme: 'light'
        }
        this.favorites = user && user.favorites || [];
    }
}
