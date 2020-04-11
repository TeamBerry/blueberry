import { Injectable } from "@angular/core";

import { Video } from './video.model';

@Injectable()
export class QueueVideo {
    _id: string;
    endTime: Date;
    startTime: Date;
    submittedAt: Date;
    submitted_by: {
        _id: string;
        name: string;
    };
    video: Video;
    isPreselected: boolean;
}
