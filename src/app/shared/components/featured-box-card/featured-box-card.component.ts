import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Box } from 'app/shared/models/box.model';

@Component({
  selector: 'app-featured-box-card',
  templateUrl: './featured-box-card.component.html',
  styleUrls: ['./featured-box-card.component.scss']
})
export class FeaturedBoxCardComponent implements OnInit, OnChanges {
    @Input() box: Box;
    currentVideo: any;

    constructor() { }

    ngOnInit() {
        this.displayCurrentVideo();
    }

    ngOnChanges() {
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
