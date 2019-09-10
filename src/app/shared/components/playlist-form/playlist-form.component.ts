import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { User } from 'app/shared/models/user.model';
import { UserPlaylist } from 'app/shared/models/user-playlist.model';
import { PlaylistService } from 'app/shared/services/playlist.service';

@Component({
    selector: 'app-playlist-form',
    templateUrl: './playlist-form.component.html',
    styleUrls: ['./playlist-form.component.scss']
})
export class PlaylistFormComponent implements OnInit {
    @Input() title: string
    @Input() playlist: UserPlaylist
    @Input() user: User

    context: 'create' | 'edit' = 'edit'

    constructor(
        public activeModal: NgbActiveModal,
        public playlistService: PlaylistService
    ) { }

    ngOnInit() {
        if (!this.playlist) {
            this.context = 'create'
            this.playlist = new UserPlaylist({ user: { _id: this.user._id, name: this.user.name } })
        }
    }

    onSubmit() {
        console.log(this.playlist)
        if (this.context === 'create') {
            this.playlistService.store(this.playlist).subscribe(
                (response: UserPlaylist) => {
                    this.activeModal.close();
                }
            )
        } else {
            this.playlistService.update(this.playlist).subscribe(
                (response: UserPlaylist) => {
                    this.activeModal.close();
                }
            )
        }
    }

}
