import { Component, OnInit, Input, EventEmitter, Output, OnChanges } from '@angular/core';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';

import { User } from 'app/shared/models/user.model';
import { UserService } from 'app/shared/services/user.service';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
    selector: 'app-mood-widget',
    templateUrl: './mood-widget.component.html',
    styleUrls: ['./mood-widget.component.scss'],
    providers: [UserService]
})
export class MoodWidgetComponent implements OnInit, OnChanges {
    @Input() video;
    @Input() user: User;

    isLiked = false;
    currentVote = null;

    constructor(
        public authService: AuthService,
        public userService: UserService,
        private toastr: ToastrService
    ) { }

    ngOnInit() {
        if (this.video) {
            this.isLiked = this.checkFavorites();
        }
    }

    ngOnChanges(changes) {
        if (changes.video && changes.video.currentValue) {
            this.video = changes.video.currentValue;
            this.isLiked = this.checkFavorites();
        }
    }

    /**
     * Checks if the currently playing video is in the list of favorites
     *
     * @returns {boolean} Whether the user has the video in their favorites
     * @memberof MoodWidgetComponent
     */
    checkFavorites(): boolean {
        return (_.findIndex(this.user.favorites, { '_id': this.video._id }) !== -1);
    }

    /**
     * Adds a video to the array of favorites
     *
     * @memberof MoodWidgetComponent
     */
    likeVideo() {
        this.user.favorites.push(this.video);
        this.userService.updateFavorites(this.user).subscribe(
            (user: User) => {
                this.authService.setUser(user);
                this.toastr.success('Video added to favorites.', 'Success');
                this.isLiked = true;
            }
        );
    }

    /**
     * Removes a video from the list of favorites
     *
     * @memberof MoodWidgetComponent
     */
    unlikeVideo() {
        // Delete one or more (you never know) instances of the video in the favorites
        const newFavorites = this.user.favorites.filter(favorite => {
            return favorite._id !== this.video._id;
        })

        this.user.favorites = newFavorites;

        this.userService.updateFavorites(this.user).subscribe(
            (user: User) => {
                this.authService.setUser(user);
                this.toastr.success('Video removed from favorites.', 'Success');
                this.isLiked = false;
            }
        );
    }

}
