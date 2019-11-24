import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PlaylistVideo } from 'app/shared/models/playlist-video.model';
import { AuthService } from 'app/core/auth/auth.service';
import { AuthSubject } from 'app/shared/models/session.model';

@Component({
    selector: 'app-playlist-video',
    templateUrl: './playlist-video.component.html',
    styleUrls: ['./playlist-video.component.scss']
})
export class PlaylistVideoComponent implements OnInit {

    @Input() item: PlaylistVideo;

    @Output() order: EventEmitter<{ item: any, order: string }> = new EventEmitter();

    user: AuthSubject = AuthService.getAuthSubject()

    constructor() { }

    ngOnInit() {
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

}
