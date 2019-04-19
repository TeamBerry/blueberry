import { Injectable } from "@angular/core";

import { Video } from './video.model';

@Injectable()
export class PlaylistItem {
    _id: string;
    endTime: number;
    ignored: boolean;
    startTime: number;
    submitted_at: number;
    submitted_by: {
        _id: string;
        name: string;
    };
    video: Video;
}