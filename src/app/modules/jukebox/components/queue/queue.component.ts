import { Component, OnInit, Input } from '@angular/core';

import { JukeboxService } from '../../jukebox.service';
import { Box } from '../../../../shared/models/box.model';
import { User } from 'app/shared/models/user.model';
import { QueueVideo } from 'app/shared/models/playlist-video.model';
import { SubmissionPayload, PlaylistItemActionRequest } from 'app/shared/models/playlist-payload.model';
import { PlaylistSelectorComponent } from 'app/shared/components/playlist-selector/playlist-selector.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PlaylistService } from 'app/shared/services/playlist.service';
import { BoxService } from 'app/shared/services/box.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-queue',
    templateUrl: './queue.component.html',
    styleUrls: ['./queue.component.scss'],
})
export class QueueComponent implements OnInit {
    box: Box;
    @Input() user: User = new User;

    currentlyPlaying: QueueVideo;
    playedVideos: Array<QueueVideo>;
    upcomingVideos: Array<QueueVideo>;

    constructor(
        private jukeboxService: JukeboxService,
        private modalService: NgbModal,
        private boxService: BoxService,
        private toastr: ToastrService
    ) { }

    ngOnInit() {
        this.listen();
    }

    /**
     * Subscribe to the box from the jukebox space, to get the playlist when needed
     *
     * @memberof PlaylistComponent
     */
    listen() {
        this.jukeboxService.getBox().subscribe(
            (box: Box) => {
                this.box = box;
                this.currentlyPlaying = this.getCurrentlyPlayingVideo(this.box.playlist);
                this.playedVideos = this.buildPartialPlaylist(this.box.playlist, 'played');
                this.upcomingVideos = this.buildPartialPlaylist(this.box.playlist, 'upcoming').reverse();
            }
        );
    }

    /**
     * Isolates the currently playing video
     *
     * @param {Array<QueueVideo>} playlist The playlist of the box
     * @returns {QueueVideo} The currently playing video
     * @memberof PlaylistComponent
     */
    getCurrentlyPlayingVideo(playlist: Array<QueueVideo>): QueueVideo {
        return playlist.find((item: QueueVideo) => {
            return item.startTime !== null && item.endTime === null;
        });
    }

    /**
     * Builds a partial list of the playlist of the box based on the wanted state of the videos
     *
     * @param {Array<QueueVideo>} playlist The playlist of the box
     * @param {string} state The state of the videos. Upcoming or Played
     * @returns {Array<QueueVideo>}
     * @memberof PlaylistComponent
     */
    buildPartialPlaylist(playlist: Array<QueueVideo>, state: string): Array<QueueVideo> {
        if (state === 'upcoming') {
            return playlist.filter((item: QueueVideo) => {
                return item.startTime === null;
            });
        }

        if (state === 'played') {
            return playlist.filter((item: QueueVideo) => {
                return item.startTime !== null && item.endTime !== null;
            });
        }
    }

    /**
     * Triggered by the order$ event of the playlist item component.
     *
     * @param {*} event
     * @memberof PlaylistComponent
     */
    handlePlaylistOrder(event) {
        const actionRequest: PlaylistItemActionRequest = {
            item: event.item,
            userToken: this.user._id,
            boxToken: this.box._id
        }

        switch (event.order) {
            case 'replay':
                this.replayVideo(event.item)
                break

            case 'cancel':
                this.jukeboxService.cancelVideo(actionRequest)
                break

            case 'skip':
                this.jukeboxService.skipVideo()
                break
        }
    }

    /**
     * Triggered by the order$ event of the playlist item component.
     *
     * Resubmits the video in the playlist of the box
     *
     * @param {QueueVideo['video']['link']} link The Youtube link of the video
     * @memberof PlaylistComponent
     */
    replayVideo(link: QueueVideo['video']['link']) {
        const submissionPayload: SubmissionPayload = {
            link: link,
            userToken: this.user._id,
            boxToken: this.box._id
        };
        this.jukeboxService.submitVideo(submissionPayload);
    }

    swap(video: any, direction: string) {
        const action = {
            room_history_id: video.room_history_id,
            playlist_order: video.playlist_order,
            direction: direction
        };

        this.jukeboxService.swap();
    }

    /**
     * Requests the currently playing video be skipped.
     *
     * @memberof PlaylistComponent
     */
    requestSkip() {

    }

    startConversion() {
        const modalRef = this.modalService.open(PlaylistSelectorComponent);
        modalRef.componentInstance.selectedPlaylist$.subscribe(
            async (playlistId: string) => {
                this.boxService.convert(this.box._id, playlistId).subscribe()
                this.toastr.success('Playlist updated', 'Success')
            }
        )

    }
}
