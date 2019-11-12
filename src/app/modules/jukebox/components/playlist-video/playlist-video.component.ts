import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PlaylistVideo } from 'app/shared/models/playlist-video.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PlaylistSelectorComponent } from 'app/shared/components/playlist-selector/playlist-selector.component';
import { UserPlaylist } from 'app/shared/models/user-playlist.model';

@Component({
    selector: 'app-playlist-video',
    templateUrl: './playlist-video.component.html',
    styleUrls: ['./playlist-video.component.scss']
})
export class PlaylistVideoComponent implements OnInit {

    @Input() item: PlaylistVideo;

    @Output() resubmit$: EventEmitter<string> = new EventEmitter();

    constructor(
        private modalService: NgbModal
    ) { }

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

    /**
     * Opens a modal allowing to select a playlist from the user to add the video to
     *
     * @param {PlaylistVideo} item
     * @memberof PlaylistVideoComponent
     */
    addToPlaylist(item: PlaylistVideo) {
        const modalRef = this.modalService.open(PlaylistSelectorComponent);
        modalRef.componentInstance.selectedPlaylist$.subscribe(
            (playlist: UserPlaylist) => {
                console.log('Selected playlist: ', playlist)
            }
        )
    }

}
