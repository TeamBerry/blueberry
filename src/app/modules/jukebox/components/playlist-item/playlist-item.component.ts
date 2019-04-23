import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PlaylistItem } from 'app/shared/models/playlist-item.model';

@Component({
    selector: 'app-playlist-item',
    templateUrl: './playlist-item.component.html',
    styleUrls: ['./playlist-item.component.scss']
})
export class PlaylistItemComponent implements OnInit {

    @Input() item: PlaylistItem;

    @Output() resubmit$: EventEmitter<string> = new EventEmitter();

    constructor() { }

    ngOnInit() {
    }

    /**
     * Resubmits a video that was played back in the queue of the playlist
     *
     * @param {PlaylistItem} item The playlist item
     * @memberof PlaylistItemComponent
     */
    resubmit(item: PlaylistItem) {
        this.resubmit$.emit(item.video.link);
    }

}
