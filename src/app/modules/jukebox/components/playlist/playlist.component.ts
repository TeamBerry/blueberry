import { Component, OnInit, Input } from '@angular/core';

import { JukeboxService } from './../../jukebox.service';
import { Box } from '../../../../shared/models/box.model';
import { User } from 'app/shared/models/user.model';
import { PlaylistVideo } from 'app/shared/models/playlist-video.model';
import { SubmissionPayload, CancelPayload } from 'app/shared/models/playlist-payload.model';

@Component({
    selector: 'app-playlist',
    templateUrl: './playlist.component.html',
    styleUrls: ['./playlist.component.scss'],
})
export class PlaylistComponent implements OnInit {
    box: Box;
    @Input() user: User = new User;

    currentlyPlaying: PlaylistVideo;
    playedVideos: Array<PlaylistVideo>;
    upcomingVideos: Array<PlaylistVideo>;

    constructor(
        private jukeboxService: JukeboxService,
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
     * @param {Array<PlaylistVideo>} playlist The playlist of the box
     * @returns {PlaylistVideo} The currently playing video
     * @memberof PlaylistComponent
     */
    getCurrentlyPlayingVideo(playlist: Array<PlaylistVideo>): PlaylistVideo {
        return playlist.find((item: PlaylistVideo) => {
            return item.startTime !== null && item.endTime === null;
        });
    }

    /**
     * Builds a partial list of the playlist of the box based on the wanted state of the videos
     *
     * @param {Array<PlaylistVideo>} playlist The playlist of the box
     * @param {string} state The state of the videos. Upcoming or Played
     * @returns {Array<PlaylistVideo>}
     * @memberof PlaylistComponent
     */
    buildPartialPlaylist(playlist: Array<PlaylistVideo>, state: string): Array<PlaylistVideo> {
        if (state === 'upcoming') {
            return playlist.filter((item: PlaylistVideo) => {
                return item.startTime === null;
            });
        }

        if (state === 'played') {
            return playlist.filter((item: PlaylistVideo) => {
                return item.startTime !== null && item.endTime !== null;
            });
        }
    }

    handlePlaylistOrder(event) {
        if (event.order === 'replay') {
            this.replayVideo(event.item)
        }

        if (event.order === 'cancel') {
            this.cancelVideo(event.item)
        }
    }

    /**
     * Triggered by the order$ event of the playlist item component.
     *
     * Resubmits the video in the playlist of the box
     *
     * @param {PlaylistVideo['video']['link']} link The Youtube link of the video
     * @memberof PlaylistComponent
     */
    replayVideo(link: PlaylistVideo['video']['link']) {
        const submissionPayload: SubmissionPayload = {
            link: link,
            userToken: this.user._id,
            boxToken: this.box._id
        };
        this.jukeboxService.submitVideo(submissionPayload);
    }

    /**
     * Triggered by the order$ event of the playlist item component.
     *
     * Cancels an entry in the upcoming part of the playlist of the box
     *
     * @param {PlaylistVideo['_id']} item The identifier of the playlist item
     * @memberof PlaylistComponent
     */
    cancelVideo(item: PlaylistVideo['_id']) {
        const cancelPayload: CancelPayload = {
            item: item,
            userToken: this.user._id,
            boxToken: this.box._id
        }

        this.jukeboxService.cancelVideo(cancelPayload);
    }

    swap(video: any, direction: string) {
        const action = {
            room_history_id: video.room_history_id,
            playlist_order: video.playlist_order,
            direction: direction
        };

        this.jukeboxService.swap();
    }

    banVideo(video: any) {
        video.video_status = 3;
        this.jukeboxService.toggle();
    }

    unbanVideo(video: any) {
        video.video_status = 0;
        this.jukeboxService.toggle();
    }


    /**
     * Requests the currently playing video be skipped.
     *
     * @memberof PlaylistComponent
     */
    requestSkip() {

    }

}
