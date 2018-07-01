import { Component, OnInit, Input } from '@angular/core';

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
