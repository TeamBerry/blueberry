import { Component, OnInit, Input } from '@angular/core';
import { PlaylistItem } from 'app/shared/models/playlist-item.model';

@Component({
    selector: 'app-playlist-item',
    templateUrl: './playlist-item.component.html',
    styleUrls: ['./playlist-item.component.scss']
})
export class PlaylistItemComponent implements OnInit {

    @Input() item: PlaylistItem;

    constructor() { }

    ngOnInit() {
    }

}
