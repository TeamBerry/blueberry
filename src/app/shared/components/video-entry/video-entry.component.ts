import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-video-entry',
    templateUrl: './video-entry.component.html',
    styleUrls: ['./video-entry.component.scss']
})
export class VideoEntryComponent implements OnInit {

    @Input() video;

    constructor() { }

    ngOnInit() {
    }

}
