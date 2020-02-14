import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Video } from 'app/shared/models/video.model';
import { UserService } from 'app/shared/services/user.service';

@Component({
    selector: 'app-favorites-admin-widget',
    templateUrl: './favorites-admin-widget.component.html',
    styleUrls: ['./favorites-admin-widget.component.scss']
})
export class FavoritesAdminWidgetComponent implements OnInit {

    @Input() video: Video;
    @Output() refresh: EventEmitter<any> = new EventEmitter();

    constructor(
        private userService: UserService
    ) { }

    ngOnInit() {
    }

    remove() {
        this.userService.updateFavorites({ action: 'unlike', target: this.video._id }).subscribe(
            () => {
                this.refresh.emit();
            }
        )
    }

}
