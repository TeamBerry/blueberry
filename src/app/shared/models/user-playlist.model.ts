import { Injectable } from '@angular/core';
import { Video } from './video.model';

@Injectable()
export class UserPlaylist {
    _id: string;
    name: string;
    isPrivate: boolean;
    user: {
        _id: string,
        name: string
    };
    videos: Array<Partial<Video>>;
    createdAt: Date;
    updatedAt: Date;

    constructor(obj?: Partial<UserPlaylist>) {
        this._id = obj && obj._id || null;
        this.name = obj && obj.name || null;
        this.isPrivate = obj && obj.isPrivate || false;
        this.user = obj && obj.user || { _id: null, name: null };
        this.videos = obj && obj.videos || [];
        this.createdAt = obj && obj.createdAt || null;
        this.updatedAt = obj && obj.updatedAt || null;
    }
}
