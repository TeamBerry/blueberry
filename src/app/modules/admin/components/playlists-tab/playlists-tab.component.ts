import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthService } from 'app/core/auth/auth.service';
import { User } from 'app/shared/models/user.model';
import { UserPlaylist } from 'app/shared/models/user-playlist.model';
import { UserService } from 'app/shared/services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PlaylistFormComponent } from 'app/shared/components/playlist-form/playlist-form.component';
import { PlaylistViewComponent } from 'app/shared/components/playlist-view/playlist-view.component';

@Component({
    selector: 'app-playlists-tab',
    templateUrl: './playlists-tab.component.html',
    styleUrls: ['./playlists-tab.component.scss'],
    providers: [UserService]
})
export class PlaylistsTabComponent implements OnInit {
    @Input() user: User = AuthService.getSession()

    public playlists: Observable<Array<UserPlaylist>>

    constructor(
        private modalService: NgbModal,
        private userService: UserService
    ) { }

    ngOnInit() {
        this.playlists = this.userService.playlists(this.user)
    }

    openCreateModal(playlist?: UserPlaylist) {
        const modalRef = this.modalService.open(PlaylistFormComponent)
        modalRef.componentInstance.title = !playlist ? 'Create a playlist' : `Edit ${playlist.name}`
        modalRef.componentInstance.playlist = playlist
        modalRef.componentInstance.user = this.user
    }

    viewPlaylist(playlist: UserPlaylist) {
        const modalRef = this.modalService.open(PlaylistViewComponent, {
            size: 'lg'
        });
        modalRef.componentInstance.playlist = playlist;
    }

}
