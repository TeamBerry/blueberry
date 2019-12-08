import { Component, OnInit, Input } from '@angular/core';
import * as _ from 'lodash';

import { Box } from '../../models/box.model';
import { environment } from 'environments/environment';

@Component({
    selector: 'app-box-widget',
    templateUrl: './box-widget.component.html',
    styleUrls: ['./box-widget.component.scss']
})
export class BoxWidgetComponent implements OnInit {
    @Input() box: Box;
    currentVideo: any;

    /**
     * Picture location of the creator of the box
     *
     * @memberof BoxWidgetComponent
     */
    public pictureLocation = '../../../assets/images/berrybox-staff-logo.png';

    constructor() { }

    ngOnInit() {
        this.displayCurrentVideo();
        this.pictureLocation = `${environment.amazonBuckets}/${environment.profilePictureBuckets}/${this.box.creator._id}-picture`
    }

    /**
     * Gets the currently playing video from the box playlist.
     *
     * TODO: If no video is playing
     * @memberof BoxWidgetComponent
     */
    displayCurrentVideo() {
        const playingVideo = _.filter(this.box.playlist, (video) => {
            return video.startTime !== null && video.endTime === null;
        });
        this.currentVideo = playingVideo[0];
    }
}
