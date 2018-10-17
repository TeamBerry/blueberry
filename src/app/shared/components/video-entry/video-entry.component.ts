import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Video } from '../../models/video.model';

@Component({
    selector: 'app-video-entry',
    templateUrl: './video-entry.component.html',
    styleUrls: ['./video-entry.component.scss']
})
export class VideoEntryComponent implements OnInit {

    @Input() video: Video;

    @Output() submit: EventEmitter<Video> = new EventEmitter();

    constructor() { }

    ngOnInit() {
    }

    submitVideo() {
        this.submit.emit(this.video);
    }

}
