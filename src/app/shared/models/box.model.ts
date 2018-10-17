import { Injectable } from '@angular/core';

@Injectable()
export class Box {
    _id: string;
    creator: {
        _id: string,
        name: string
    };
    description: string;
    lang: string;
    name: string;
    playlist: any[];

    constructor(obj?: any) {
        this._id = obj && obj._id || null;
        this.creator = obj && obj.creator || undefined;
        this.description = obj && obj.description || null;
        this.lang = obj && obj.lang || 'English';
        this.name = obj && obj.name || null;
        this.playlist = obj && obj.playlist || [];
    }
}
