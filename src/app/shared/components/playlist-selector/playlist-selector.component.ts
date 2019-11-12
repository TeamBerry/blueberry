import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UserPlaylist } from 'app/shared/models/user-playlist.model';
import { } from 'events';
import { UserService } from 'app/shared/services/user.service';
import { User } from 'app/shared/models/user.model';
import { AuthService } from 'app/core/auth/auth.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-playlist-selector',
    templateUrl: './playlist-selector.component.html',
    styleUrls: ['./playlist-selector.component.scss'],
    providers: [UserService]
})
export class PlaylistSelectorComponent implements OnInit {

    userPlaylists

    user: User = AuthService.getSession()

    @Output() selectedPlaylist$: EventEmitter<UserPlaylist> = new EventEmitter<UserPlaylist>();

    constructor(
        public activeModal: NgbActiveModal,
        private userService: UserService
    ) { }

    ngOnInit() {
        this.userPlaylists = this.userService.playlists(this.user)
    }

}
