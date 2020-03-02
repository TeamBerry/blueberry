import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PlaylistVideo } from 'app/shared/models/playlist-video.model';
import { AuthService } from 'app/core/auth/auth.service';
import { AuthSubject } from 'app/shared/models/session.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PlaylistSelectorComponent } from 'app/shared/components/playlist-selector/playlist-selector.component';
import { PlaylistService } from 'app/shared/services/playlist.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-playlist-video',
    templateUrl: './playlist-video.component.html',
    styleUrls: ['./playlist-video.component.scss']
})
export class PlaylistVideoComponent implements OnInit {

    @Input() item: PlaylistVideo;

    @Output() order: EventEmitter<{ item: any, order: string }> = new EventEmitter();

    user: AuthSubject = AuthService.getAuthSubject()

    status: 'upcoming' | 'playing' | 'played'

    constructor(
        private modalService: NgbModal,
        private playlistService: PlaylistService,
        private toastr: ToastrService
    ) { }

    ngOnInit() {
        this.status = this.computeStatus()
    }

    computeStatus(): 'upcoming' | 'playing' | 'played' {
        if (this.item.startTime === null) {
            return 'upcoming'
        }
        if (this.item.startTime !== null && this.item.endTime === null) {
            return 'playing'
        }
        return 'played'
    }

    /**
     * Skips the video
     *
     * @param {PlaylistVideo} item
     * @memberof PlaylistVideoComponent
     */
    skipVideo(item: PlaylistVideo) {
        this.order.emit({ item: item._id, order: 'skip' })
    }

    /**
     * Cancels a video from the upcoming section
     *
     * @param {PlaylistVideo} item
     * @memberof PlaylistVideoComponent
     */
    cancelVideo(item: PlaylistVideo) {
        this.order.emit({ item: item._id, order: 'cancel' });
    }

    /**
     * Resubmits a video that was played back in the queue of the playlist
     *
     * @param {PlaylistVideo} item The playlist item
     * @memberof PlaylistItemComponent
     */
    replayVideo(item: PlaylistVideo) {
        this.order.emit({ item: item.video.link, order: 'replay' });
    }

    addToPlaylist() {
        const modalRef = this.modalService.open(PlaylistSelectorComponent)
        modalRef.componentInstance.selectedPlaylist$.subscribe(
            (playlistId: string) => {
                this.playlistService.addVideoToPlaylist(playlistId, { videoId: this.item.video._id }).toPromise()
                this.toastr.success('Video added', 'Success')
            }
        )
    }
}
