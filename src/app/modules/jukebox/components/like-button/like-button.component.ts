import { Component, OnInit, Input, OnChanges } from '@angular/core';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';

import { User } from 'app/shared/models/user.model';
import { UserService } from 'app/shared/services/user.service';
import { AuthService } from 'app/core/auth/auth.service';
import { JukeboxService } from '../../jukebox.service';
import { Video } from 'app/shared/models/video.model';

@Component({
    selector: 'app-like-button',
    templateUrl: './like-button.component.html',
    styleUrls: ['./like-button.component.scss'],
})
export class LikeButtonComponent implements OnInit, OnChanges {
    @Input() video: Video;

    isLiked = false;
    isChecking = false;
    currentVote = null;

    constructor(
        public authService: AuthService,
        private jukeboxService: JukeboxService,
        public userService: UserService,
        private toastr: ToastrService
    ) { }

    ngOnInit() {
        this.listenToOrders();
        if (this.video) {
            this.checkFavorites();
        }
    }

    ngOnChanges(changes) {
        if (changes.video && changes.video.currentValue) {
            this.video = changes.video.currentValue;
            this.checkFavorites();
        }
    }

    /**
     * Checks if the currently playing video is in the list of favorites
     *
     * @returns {boolean} Whether the user has the video in their favorites
     * @memberof LikeButtonComponent
     */
    checkFavorites() {
        if (this.isChecking === false) {
            console.log('CHECKING', this.video._id)
            this.isLiked = false
            this.isChecking = true
            this.userService.favorites().subscribe(
                (favorites: Array<User['favorites']>) => {
                    this.isLiked = _.findIndex(favorites, { _id: this.video._id }) !== -1;
                    this.isChecking = false;
                }
            )
        }
    }

    /**
     * Adds a video to the array of favorites
     *
     * @memberof LikeButtonComponent
     */
    likeVideo() {
        this.userService.updateFavorites({ action: 'like', target: this.video._id }).subscribe(
            () => {
                this.toastr.success('Video added to favorites.', 'Success');
                this.isLiked = true;
                this.jukeboxService.sendOrder('favorites');
            }
        );
    }

    /**
     * Removes a video from the list of favorites
     *
     * @memberof LikeButtonComponent
     */
    unlikeVideo() {
        this.userService.updateFavorites({ action: 'unlike', target: this.video._id }).subscribe(
            () => {
                this.toastr.success('Video removed from favorites.', 'Success');
                this.isLiked = false;
                this.jukeboxService.sendOrder('favorites');
            }
        );
    }

    listenToOrders() {
        this.jukeboxService.getOrderStream().subscribe(
            (order: string) => {
                if (order === 'favorites') {
                    console.log('Favorites have been refreshed. Checking if video is in favorites.');
                    this.checkFavorites();
                }
            })
    }
}
