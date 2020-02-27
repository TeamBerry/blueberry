import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { Video } from '../../models/video.model';
import { UserService } from 'app/shared/services/user.service';
import { JukeboxService } from 'app/modules/jukebox/jukebox.service';

@Component({
    selector: 'app-video-entry',
    templateUrl: './video-entry.component.html',
    styleUrls: ['./video-entry.component.scss']
})
export class VideoEntryComponent implements OnInit {

    @Input() video: Video;
    @Input() options: {
        submit?: boolean,
        favorite?: boolean
    } = {}

    appliedOptions = {
        submit: true,
        favorite: true
    }

    @Output() submit: EventEmitter<Video> = new EventEmitter();

    constructor(
        private userService: UserService,
        private jukeboxService: JukeboxService,
        private toastr: ToastrService
    ) { }

    ngOnInit() {
        this.buildOptions()
    }

    buildOptions() {
        Object.keys(this.options).map(
            (value: string) => {
                this.appliedOptions[value] = this.options[value]
            }
        )
    }

    submitVideo() {
        this.submit.emit(this.video);
    }

    removeVideo() {
        this.userService.updateFavorites({ action: 'unlike', target: this.video._id }).subscribe(
            () => {
                this.toastr.success('Video removed from favorites.', 'Success');
                this.jukeboxService.sendOrder('favorites');
            }
        )
    }

}
