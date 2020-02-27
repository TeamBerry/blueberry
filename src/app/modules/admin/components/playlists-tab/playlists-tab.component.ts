import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthService } from 'app/core/auth/auth.service';
import { User } from 'app/shared/models/user.model';
import { UserPlaylist } from 'app/shared/models/user-playlist.model';
import { UserService } from 'app/shared/services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PlaylistFormComponent } from 'app/shared/components/playlist-form/playlist-form.component';
import { PlaylistViewComponent } from 'app/shared/components/playlist-view/playlist-view.component';
import { AuthSubject } from 'app/shared/models/session.model';

@Component({
    selector: 'app-playlists-tab',
    templateUrl: './playlists-tab.component.html',
    styleUrls: ['./playlists-tab.component.scss'],
    providers: [UserService]
})
export class PlaylistsTabComponent implements OnInit {
    public playlists: Array<UserPlaylist>
    user: AuthSubject = AuthService.getAuthSubject();
    selectedPlaylist: UserPlaylist = null;

    constructor(
        private modalService: NgbModal,
        private userService: UserService
    ) { }

    ngOnInit() {
        this.userService.playlists(this.user).subscribe(
            (playlists: Array<UserPlaylist>) => {
                this.playlists = playlists;

                if (playlists.length > 0) {
                    this.selectedPlaylist = playlists[0];
                }
            }
        )
    }

    selectPlaylist(playlistId: string) {
        this.selectedPlaylist = this.playlists.find((item: UserPlaylist) => item._id === playlistId)
    }

    openCreateModal(playlist?: UserPlaylist) {
        const modalRef = this.modalService.open(PlaylistFormComponent)
        modalRef.componentInstance.title = !playlist ? 'Create a playlist' : `Edit ${playlist.name}`
        modalRef.componentInstance.playlist = playlist
        modalRef.componentInstance.user = this.user
    }
}
