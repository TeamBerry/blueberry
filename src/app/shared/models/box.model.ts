import { Injectable } from '@angular/core';

@Injectable()
export class Box {
    playlist: any[];
    creator: string;
    description: string;
    name: string;
    _id: string;

    constructor(obj?: any) {
        this.creator = obj && obj.creator || null;
        this.description = obj && obj.description || null;
        this.name = obj && obj.name || null;
        this.playlist = obj && obj.playlist || [];
        this._id = obj && obj._id || null;
    }
}
