import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PlaylistVideo } from 'app/shared/models/playlist-video.model';

@Component({
    selector: 'app-playlist-video',
    templateUrl: './playlist-video.component.html',
    styleUrls: ['./playlist-video.component.scss']
})
export class PlaylistVideoComponent implements OnInit {

    @Input() item: PlaylistVideo;

    @Output() resubmit$: EventEmitter<string> = new EventEmitter();

    constructor() { }

    ngOnInit() {
    }

    /**
     * Resubmits a video that was played back in the queue of the playlist
     *
     * @param {PlaylistVideo} item The playlist item
     * @memberof PlaylistItemComponent
     */
    resubmit(item: PlaylistVideo) {
        this.resubmit$.emit(item.video.link);
    }

}
