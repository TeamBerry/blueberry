import { Injectable } from '@angular/core';

import { PlaylistVideo } from './playlist-video.model';

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
    playlist: Array<PlaylistVideo>;
    open: boolean;
    createdAt: Date;
    updatedAt: Date;
    options: {
        /**
         * The next video will be picked at random from the playlist
         *
         * @type {Boolean}
         */
        random: Boolean;
        /**
         * If there are more than 10 submitted videos and less than 3 upcoming videos, one video at random from the
         * pool of 10 will be added to the list of upcoming videos
         *
         * @type {Boolean}
         */
        refresh: Boolean;
    }

    constructor(obj?: any) {
        this._id = obj && obj._id || null;
        this.creator = obj && obj.creator || null;
        this.description = obj && obj.description || null;
        this.lang = obj && obj.lang || 'English';
        this.name = obj && obj.name || null;
        this.playlist = obj && obj.playlist || [];
        this.open = obj && obj.open || true;
        this.options = obj && obj.options || {
            random: false,
            refresh: false
        }
        this.createdAt = obj && obj.createdAt || null;
        this.updatedAt = obj && obj.updatedAt || null;
    }
}
