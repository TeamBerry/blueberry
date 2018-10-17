import { Injectable } from "@angular/core";

@Injectable()
export class Video {
    _id: string;
    name: string;
    link: string;

    constructor(obj?: any) {
        this._id = obj && obj._id || null;
        this.name = obj && obj.name || null;
        this.link = obj && obj.link || null;
    }
}
