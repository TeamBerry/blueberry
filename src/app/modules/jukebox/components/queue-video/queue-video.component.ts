import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { QueueVideo } from 'app/shared/models/playlist-video.model';
import { AuthService } from 'app/core/auth/auth.service';
import { AuthSubject } from 'app/shared/models/session.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PlaylistSelectorComponent } from 'app/shared/components/playlist-selector/playlist-selector.component';
import { PlaylistService } from 'app/shared/services/playlist.service';
import { ToastrService } from 'ngx-toastr';
import { Box } from 'app/shared/models/box.model';

@Component({
    selector: 'app-queue-video',
    templateUrl: './queue-video.component.html',
    styleUrls: ['./queue-video.component.scss']
})
export class QueueVideoComponent implements OnInit {

    @Input() box: Box;

    @Input() item: QueueVideo;

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
     * @param {QueueVideo} item
     * @memberof PlaylistVideoComponent
     */
    skipVideo(item: QueueVideo) {
        this.order.emit({ item: item._id, order: 'skip' })
    }

    /**
     * Cancels a video from the upcoming section
     *
     * @param {QueueVideo} item
     * @memberof PlaylistVideoComponent
     */
    cancelVideo(item: QueueVideo) {
        this.order.emit({ item: item._id, order: 'cancel' });
    }

    /**
     * Resubmits a video that was played back in the queue of the playlist
     *
     * @param {QueueVideo} item The playlist item
     * @memberof PlaylistItemComponent
     */
    replayVideo(item: QueueVideo) {
        this.order.emit({ item: item.video.link, order: 'replay' });
    }

    /**
     * Preselects/Unselects a video from the upcoming section
     *
     * @param {QueueVideo} item
     * @memberof QueueVideoComponent
     */
    togglePreselection(item: QueueVideo) {
        this.order.emit({ item: item._id, order: 'preselect' });
    }

    /**
     * Force plays a video from the upcoming section
     *
     * @param {QueueVideo} item
     * @memberof QueueVideoComponent
     */
    forcePlay(item: QueueVideo) {
        this.order.emit({ item: item._id, order: 'forcePlay' });
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
