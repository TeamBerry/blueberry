import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { UserPlaylist } from 'app/shared/models/user-playlist.model';
import { PlaylistService } from 'app/shared/services/playlist.service';

@Component({
    selector: 'app-playlists',
    templateUrl: './playlists.component.html',
    styleUrls: ['./playlists.component.scss']
})
export class PlaylistsComponent implements OnInit {
    public playlists: Observable<Array<UserPlaylist>>;

    constructor(
        private playlistService: PlaylistService
    ) { }

    ngOnInit() {
        this.playlists = this.playlistService.index();
    }

}
