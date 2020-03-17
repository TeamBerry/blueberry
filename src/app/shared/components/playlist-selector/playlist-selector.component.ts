import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UserPlaylist } from 'app/shared/models/user-playlist.model';
import { } from 'events';
import { UserService } from 'app/shared/services/user.service';
import { User } from 'app/shared/models/user.model';
import { AuthService } from 'app/core/auth/auth.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthSubject } from 'app/shared/models/session.model';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-playlist-selector',
    templateUrl: './playlist-selector.component.html',
    styleUrls: ['./playlist-selector.component.scss'],
    providers: [UserService]
})
export class PlaylistSelectorComponent implements OnInit {

    userPlaylists$: Observable<UserPlaylist[]>

    user: AuthSubject = AuthService.getAuthSubject()

    @Output() selectedPlaylist$: EventEmitter<UserPlaylist['_id']> = new EventEmitter<UserPlaylist['_id']>();

    constructor(
        public activeModal: NgbActiveModal,
        private userService: UserService
    ) { }

    ngOnInit() {
        this.userPlaylists$ = this.userService.playlists(this.user)
    }

    selectPlaylist(playlistId: string) {
        this.selectedPlaylist$.emit(playlistId);
        this.activeModal.close();
    }

}
