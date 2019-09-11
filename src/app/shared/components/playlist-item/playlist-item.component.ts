import { Component, OnInit, Input } from '@angular/core';
import { UserPlaylist } from 'app/shared/models/user-playlist.model';
import { PlaylistViewComponent } from '../playlist-view/playlist-view.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-playlist-item',
    templateUrl: './playlist-item.component.html',
    styleUrls: ['./playlist-item.component.scss']
})
export class PlaylistItemComponent implements OnInit {
    @Input() playlist: UserPlaylist;

    constructor(
        private modalService: NgbModal
    ) { }

    ngOnInit() {
    }

    viewPlaylist(playlist: UserPlaylist) {
        const modalRef = this.modalService.open(PlaylistViewComponent, {
            size: 'lg'
        });
        modalRef.componentInstance.playlist = playlist;
    }

}
