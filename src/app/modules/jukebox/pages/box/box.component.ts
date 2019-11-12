import { Component, OnInit, ViewChild } from '@angular/core';
import { BoxService } from './../../../../shared/services/box.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';

import { MoodWidgetComponent } from './../../components/mood-widget/mood-widget.component';
import { JukeboxService } from './../../jukebox.service';
import { AuthService } from 'app/core/auth/auth.service';
import { Box } from 'app/shared/models/box.model';
import { User } from 'app/shared/models/user.model';
import { SyncPacket } from 'app/shared/models/sync-packet.model';
import { filter } from 'rxjs/operators';
import { PlaylistVideo } from 'app/shared/models/playlist-video.model';

@Component({
    selector: 'app-box',
    templateUrl: './box.component.html',
    styleUrls: ['./box.component.scss'],
    providers: [BoxService]
})
export class BoxComponent implements OnInit {
    /**
     * Token of the box. Unique indentifier (ObjectID from MongoDB)
     *
     * @type {string}
     * @memberof BoxComponent
     */
    token: string;

    /**
     * Box itself
     *
     * @type {Box}
     * @memberof BoxComponent
     */
    box: Box;

    /**
     * Loading flag to hide or show parts of the DOM depending on their state of readiness
     *
     * @memberof BoxComponent
     */
    loading = true;

    /**
     * The currently playing vidoe in the box. Gets refreshed by sockets and sent to the player and mood widgets
     *
     * @memberof BoxComponent
     */
    currentVideo: PlaylistVideo = null;


    /**
     * Connected user. Obtained from the auth service
     *
     * @type {User}
     * @memberof BoxComponent
     */
    user: User;

    /**
     * Integration of the Mood Widget component, though I'm not sure I need it anymore
     *
     * @private
     * @type {MoodWidgetComponent}
     * @memberof BoxComponent
     */
    @ViewChild(MoodWidgetComponent) private moodWidgetComponent: MoodWidgetComponent;

    constructor(
        private authService: AuthService,
        private boxService: BoxService,
        private jukeboxService: JukeboxService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.token = params.token;
            this.loadBox();
            if (this.authService.isLoggedIn()) {
                this.authService.getUser().subscribe(
                    (user: User) => {
                        this.user = user;
                    }
                )
            }
        });
    }

    /**
     * Loads the details of the box
     *
     * Only if you're the creator of the box. Else, you just connect to the jukeboxService and get the box from there
     *
     * @memberof BoxComponent
     */
    loadBox() {
        this.boxService.show(this.token).subscribe(
            (box: Box) => {
                this.box = box;
                // Start box once it's loaded
                this.jukeboxService.startBox(this.box);
                this.loading = false;
            }
        );
    }

    /**
     * This is where the real-time stuff happens.
     * The box will connect to the server via socket and start synchronising with other users.
     *
     * @memberof BoxComponent
     */
    connectToSyncStream() {
        console.log('connecting sync to socket...');
        this.jukeboxService.getBoxStream()
            .pipe(
                filter(syncPacket => syncPacket instanceof SyncPacket)
            )
            .subscribe(
                (syncPacket: SyncPacket) => {
                    console.log('New Sync Packet', syncPacket);
                    // Dirty, to be changed
                    if (_.has(syncPacket.item, 'video')) {
                        this.currentVideo = syncPacket.item; // Given to the player by 1-way binding
                    }
                },
                error => {
                    console.error(error);
                    console.log('socket offline');
                }
            );
    }


    /**
     * Actions when the player changes state
     *
     * The autoplay sync is only available to the administrator of the box
     *
     * @param {*} event
     * @memberof BoxComponent
     */
    onPlayerStateChange(event: any) {
        if (event === 'ready') {
            this.connectToSyncStream();
        } else if (event === 0 && (this.user._id === this.box.creator['_id'])) {
            this.jukeboxService.next();
        } else {
            console.log('Not an admin, wait for autoplay');
        }
    }
}
