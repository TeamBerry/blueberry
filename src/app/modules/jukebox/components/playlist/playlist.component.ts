import { Component, OnInit, Input } from '@angular/core';

import { JukeboxService } from './../../jukebox.service';
import { Box } from '../../../../shared/models/box.model';
import { User } from 'app/shared/models/user.model';
import { PlaylistItem } from 'app/shared/models/playlist-item.model';

@Component({
    selector: 'app-playlist',
    templateUrl: './playlist.component.html',
    styleUrls: ['./playlist.component.scss'],
})
export class PlaylistComponent implements OnInit {
    box: Box;
    @Input() user: User = new User;

    currentlyPlaying: PlaylistItem;
    playedVideos: Array<PlaylistItem>;
    upcomingVideos: Array<PlaylistItem>;

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
                console.log('GOT BOX: ', box);
            }
        );
    }

    /**
     * Isolates the currently playing video
     *
     * @param {Array<PlaylistItem>} playlist The playlist of the box
     * @returns {PlaylistItem} The currently playing video
     * @memberof PlaylistComponent
     */
    getCurrentlyPlayingVideo(playlist: Array<PlaylistItem>): PlaylistItem {
        return playlist.find((item: PlaylistItem) => {
            return item.startTime !== null && item.endTime === null;
        });
    }

    /**
     * Builds a partial list of the playlist of the box based on the wanted state of the videos
     *
     * @param {Array<PlaylistItem>} playlist The playlist of the box
     * @param {string} state The state of the videos. Upcoming or Played
     * @returns {Array<PlaylistItem>}
     * @memberof PlaylistComponent
     */
    buildPartialPlaylist(playlist: Array<PlaylistItem>, state: string): Array<PlaylistItem> {
        if (state === 'upcoming') {
            return playlist.filter((item: PlaylistItem) => {
                return item.startTime === null;
            });
        }

        if (state === 'played') {
            return playlist.filter((item: PlaylistItem) => {
                return item.startTime !== null && item.endTime !== null;
            });
        }
    }

    quickQueue(link: string) {
        const video = {
            link: link,
            userToken: this.user._id,
            boxToken: this.box._id
        };
        this.jukeboxService.submitVideo(video);
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
