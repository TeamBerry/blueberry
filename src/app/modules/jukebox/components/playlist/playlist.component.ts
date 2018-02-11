import { Component, OnInit, Input } from '@angular/core';

import { PlayerService } from './../../../../shared/services/player.service';

@Component({
    selector: 'app-playlist',
    templateUrl: './playlist.component.html',
    styleUrls: ['./playlist.component.scss'],
})
export class PlaylistComponent implements OnInit {
    @Input() token: string;
    playlist;

    constructor(
        private playerService: PlayerService
    ) { }

    ngOnInit() {
        this.fetchPlaylist();
    }

    fetchPlaylist() {
        this.playerService.playlist(this.token).subscribe(
            data => {
                this.playlist = data;
            }
        );
    }

    quickQueue(link: string) {
        const video = {
            link: link,
            author: 'D1JU70'
        };
        /* this.playerService.submit(this.token, video).subscribe(
            data => {
                this.fetchPlaylist();
            }
        ); */
    }

    swap(video: any, direction: string) {
        const action = {
            room_history_id: video.room_history_id,
            playlist_order: video.playlist_order,
            direction: direction
        };

        this.playerService.swap(this.token, action).subscribe(
            data => this.fetchPlaylist()
        );
    }

    banVideo(video: any) {
        video.video_status = 3;
        this.playerService.update(this.token, video).subscribe(
            data => this.fetchPlaylist()
        );
    }

    unbanVideo(video: any) {
        video.video_status = 0;
        this.playerService.update(this.token, video).subscribe(
            data => this.fetchPlaylist()
        );
    }

}
