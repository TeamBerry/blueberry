import { Component, OnInit, Input, EventEmitter, Output, OnChanges } from '@angular/core';
import * as _ from 'lodash';

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
        public userService: UserService
    ) { }

    ngOnInit() {
        if (this.video) {
            this.isLiked = this.checkFavorites();
        }
    }

    ngOnChanges(changes) {
        if (changes.video.currentValue) {
            this.video = changes.video.currentValue;
            this.isLiked = this.checkFavorites();
        }
    }

    checkFavorites() {
        return _.includes(this.user.favorites, this.video.link);
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
                this.isLiked = true;
            }
        );
    }

    /**
     * Removes a video from the array of favorites
     *
     * @memberof MoodWidgetComponent
     */
    unlikeVideo() {
        _.pull(this.user.favorites, this.video.link);
        this.userService.updateFavorites(this.user).subscribe(
            (user: User) => {
                this.authService.setUser(user);
                this.isLiked = false;
            }
        );
    }

}
