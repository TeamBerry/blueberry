import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { User } from 'app/shared/models/user.model';
import { Video } from 'app/shared/models/video.model';
import { JukeboxService } from 'app/modules/jukebox/jukebox.service';
import { LoginFormComponent } from '../../../../shared/components/login-form/login-form.component';
import { SignupFormComponent } from '../../../../shared/components/signup-form/signup-form.component';

@Component({
    selector: 'app-favoritelist',
    templateUrl: './favoritelist.component.html',
    styleUrls: ['./favoritelist.component.scss'],
})
export class FavoritelistComponent implements OnInit {
    @Input() boxToken: string;
    @Input() user: User = new User;

    constructor(
        private jukeboxService: JukeboxService,
        private modalService: NgbModal
    ) { }

    ngOnInit() {
    }

    /**
     * Relays the output event from the video-entry component and submits the video
     * to the box, via the jukebox service method "submitVideo"
     *
     * @param {Video} video The video to submit
     * @memberof FavoritelistComponent
     */
    submitVideo(video: Video) {
        const videoPacket = {
            link: video.link,
            userToken: this.user._id,
            boxToken: this.boxToken
        };
        this.jukeboxService.submitVideo(videoPacket);
    }

    openLoginPrompt() {
        this.modalService.open(LoginFormComponent);
    }

    openSignupPrompt() {
        this.modalService.open(SignupFormComponent);
    }
}
