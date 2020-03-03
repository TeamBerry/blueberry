import { Component, OnInit, Input } from '@angular/core';

import { UserPlaylist } from 'app/shared/models/user-playlist.model';

@Component({
    selector: 'app-playlist-view',
    templateUrl: './playlist-view.component.html',
    styleUrls: ['./playlist-view.component.scss']
})
export class PlaylistViewComponent implements OnInit {
    @Input() playlist: UserPlaylist;

    constructor() { }

    ngOnInit() {
        console.log(this.playlist)
    }

}
