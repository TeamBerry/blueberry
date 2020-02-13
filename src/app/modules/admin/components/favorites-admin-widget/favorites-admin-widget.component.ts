import { Component, OnInit, Input } from '@angular/core';
import { Video } from 'app/shared/models/video.model';

@Component({
    selector: 'app-favorites-admin-widget',
    templateUrl: './favorites-admin-widget.component.html',
    styleUrls: ['./favorites-admin-widget.component.scss']
})
export class FavoritesAdminWidgetComponent implements OnInit {

    @Input() video: Video;

    constructor() { }

    ngOnInit() {
    }

}
