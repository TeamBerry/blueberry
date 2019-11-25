import { Component, OnInit, Input, OnChanges } from '@angular/core';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';

import { User } from 'app/shared/models/user.model';
import { UserService } from 'app/shared/services/user.service';
import { AuthService } from 'app/core/auth/auth.service';
import { PlaylistVideo } from 'app/shared/models/playlist-video.model';
import { JukeboxService } from '../../jukebox.service';

@Component({
    selector: 'app-mood-widget',
    templateUrl: './mood-widget.component.html',
    styleUrls: ['./mood-widget.component.scss'],
    providers: [UserService]
})
export class MoodWidgetComponent implements OnInit, OnChanges {
    @Input() video: PlaylistVideo;

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
     * @memberof MoodWidgetComponent
     */
    checkFavorites() {
        if (this.isChecking === false) {
            console.log('CHECKING')
            this.isLiked = false
            this.isChecking = true
            this.userService.favorites({ title: this.video.video.name }).subscribe(
                (response) => {
                    if (response.length > 0) {
                        this.isLiked = true
                    }
                    this.isChecking = false;
                }
            )
        } else {
            console.log('CANNOT CHECK')
        }
    }

    /**
     * Adds a video to the array of favorites
     *
     * @memberof MoodWidgetComponent
     */
    likeVideo() {
        this.userService.updateFavorites({ action: 'like', target: this.video.video._id }).subscribe(
            (user: User) => {
                this.toastr.success('Video added to favorites.', 'Success');
                this.isLiked = true;
                this.jukeboxService.sendOrder('favorites');
            }
        );
    }

    /**
     * Removes a video from the list of favorites
     *
     * @memberof MoodWidgetComponent
     */
    unlikeVideo() {
        this.userService.updateFavorites({ action: 'unlike', target: this.video.video._id }).subscribe(
            (user: User) => {
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
                    this.checkFavorites();
                }
            })
    }
}
