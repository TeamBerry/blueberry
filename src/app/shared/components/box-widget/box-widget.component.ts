import { Component, OnInit, Input } from '@angular/core';

import { Box } from '../../models/box.model';

@Component({
    selector: 'app-box-widget',
    templateUrl: './box-widget.component.html',
    styleUrls: ['./box-widget.component.scss']
})
export class BoxWidgetComponent implements OnInit {
    @Input() box: Box;
    currentVideo: any;

    constructor() { }

    ngOnInit() {
        this.displayCurrentVideo();
    }

    /**
     * Gets the currently playing video from the box playlist.
     *
     * @memberof BoxWidgetComponent
     */
    displayCurrentVideo() {
        this.currentVideo = this.box.currentVideo;
    }
}
