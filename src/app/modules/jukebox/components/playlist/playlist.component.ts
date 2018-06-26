import { Component, OnInit, Input } from '@angular/core';

import { PlayerService } from './../../../../shared/services/player.service';
import { JukeboxService } from './../../jukebox.service';
import { Box } from '../../../../shared/models/box.model';

@Component({
    selector: 'app-playlist',
    templateUrl: './playlist.component.html',
    styleUrls: ['./playlist.component.scss'],
})
export class PlaylistComponent implements OnInit {
    @Input() token: string;
    playlist;
    box: Box;

    constructor(
        private jukeboxService: JukeboxService,
        private playerService: PlayerService
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
            (data) => {
                this.jukeboxService.setBox(this.box);
            }
        );
    }

    banVideo(video: any) {
        video.video_status = 3;
        this.playerService.update(this.token, video).subscribe(
            (data) => {
                this.jukeboxService.setBox(this.box);
            }
        );
    }

    unbanVideo(video: any) {
        video.video_status = 0;
        this.playerService.update(this.token, video).subscribe(
            (data) => {
                this.jukeboxService.setBox(this.box);
            }
        );
    }

}
