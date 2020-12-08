import { Injectable } from '@angular/core';

import { QueueItem, ACLConfig } from '@teamberry/muscadine';

@Injectable()
export class Box {
    _id: string;
    creator: {
        _id: string,
        name: string
        settings?: {
            picture: string
        }
    };
    description: string;
    lang: string;
    name: string;
    playlist: Array<QueueItem>;
    open: boolean;
    private: boolean;
    createdAt: Date;
    updatedAt: Date;
    options: {
        /**
         * The next video will be picked at random from the playlist
         *
         * @type {boolean}
         */
        random: boolean;
        /**
         * If there are more than 10 submitted videos and less than 3 upcoming videos, one video at random from the
         * pool of 10 will be added to the list of upcoming videos
         *
         * @type {boolean}
         */
        loop: boolean;
        /**
         * Activates the collect of berries and the access to admin actions by users
         *
         * @type {boolean}
         */
        berries: boolean;
        /**
         * Indicates the maximum allowed duration of a video for submission
         *
         * @type {boolean}
         */
        videoMaxDurationLimit: number;
    }
    acl: ACLConfig;
    featured: Date;
    users?: number

    constructor(obj?: any) {
        this._id = obj && obj._id || null;
        this.creator = obj && obj.creator || null;
        this.description = obj && obj.description || null;
        this.lang = obj && obj.lang || 'en';
        this.name = obj && obj.name || null;
        this.playlist = obj && obj.playlist || [];
        this.open = obj && obj.open || true;
        this.private = obj && obj.private || false;
        this.options = obj && obj.options || {
            random: false,
            loop: false,
            berries: true,
            videoMaxDurationLimit: 0
        }
        this.featured = obj && obj.featured || null;
        this.users = obj && obj.users || null;
        this.createdAt = obj && obj.createdAt || null;
        this.updatedAt = obj && obj.updatedAt || null;
    }
}
