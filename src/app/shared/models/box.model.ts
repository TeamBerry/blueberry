import { Injectable } from '@angular/core';

import { QueueVideo } from './playlist-video.model';

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
    playlist: Array<QueueVideo>;
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
        loop: Boolean;
        /**
         * Activates the collect of berries and the access to admin actions by users
         *
         * @type {Boolean}
         */
        berries: Boolean;
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
            loop: false,
            berries: true
        }
        this.createdAt = obj && obj.createdAt || null;
        this.updatedAt = obj && obj.updatedAt || null;
    }
}
