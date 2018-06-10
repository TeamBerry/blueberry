import { Injectable } from "@angular/core";

@Injectable()
export class User {
    _id: string;
    name: string;
    token: string;
    mail: string;

    constructor(obj?: any) {
        this._id = obj && obj._id || null;
        this.name = obj && obj.name || null;
        this.token = obj && obj.token || null;
        this.mail = obj && obj.mail || null;
    }
}