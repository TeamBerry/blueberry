import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { User } from 'app/shared/models/user.model';
import { Video } from 'app/shared/models/video.model';
import { JukeboxService } from 'app/modules/jukebox/jukebox.service';
import { LoginFormComponent } from '../../../../shared/components/login-form/login-form.component';
import { SignupFormComponent } from '../../../../shared/components/signup-form/signup-form.component';
import { VideoPayload } from 'app/shared/models/video-payload.model';
import { Observable } from 'rxjs';
import { UserService } from 'app/shared/services/user.service';

@Component({
    selector: 'app-favoritelist',
    templateUrl: './favoritelist.component.html',
    styleUrls: ['./favoritelist.component.scss'],
})
export class FavoritelistComponent implements OnInit {
    @Input() boxToken: string;
    @Input() user: User = new User;

    favorites$: Observable<User['favorites']>

    constructor(
        private userService: UserService,
        private jukeboxService: JukeboxService,
        private modalService: NgbModal
    ) { }

    ngOnInit() {
        this.getFavorites();
        this.listenToOrders();
    }

    /**
     * Relays the output event from the video-entry component and submits the video
     * to the box, via the jukebox service method "submitVideo"
     *
     * @param {Video} video The video to submit
     * @memberof FavoritelistComponent
     */
    submitVideo(video: Video) {
        const videoPayload: VideoPayload = {
            link: video.link,
            userToken: this.user._id,
            boxToken: this.boxToken
        };
        this.jukeboxService.submitVideo(videoPayload);
    }

    /**
     * Gets favorites
     *
     * @memberof FavoritelistComponent
     */
    getFavorites() {
        this.favorites$ = this.userService.favorites();
    }

    openLoginPrompt() {
        this.modalService.open(LoginFormComponent);
    }

    openSignupPrompt() {
        this.modalService.open(SignupFormComponent);
    }

    /**
     * Listens to the jukebox service for orders
     *
     * @memberof FavoritelistComponent
     */
    listenToOrders() {
        this.jukeboxService.getOrderStream().subscribe(
            (order: string) => {
                if (order === 'favorites') {
                    this.getFavorites();
                }
            }
        )
    }
}
