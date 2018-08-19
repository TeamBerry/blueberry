import { Component, OnInit, ViewChild } from '@angular/core';
import { BoxService } from './../../../../shared/services/box.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';

import { MoodWidgetComponent } from './../../components/mood-widget/mood-widget.component';
import { JukeboxService } from './../../jukebox.service';
import { AuthService } from 'app/core/auth/auth.service';
import { Box } from 'app/shared/models/box.model';
import { User } from 'app/shared/models/user.model';

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
     * @type {*}
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
    currentVideo = null;


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
        this.route.params.subscribe(
            params => {
                this.token = params.token;
                this.loadBox();
                this.connect();
            }
        );

        this.authService.getUser().subscribe(
            (user: User) => {
                this.user = user;
            }
        )
    }

    /**
     * Loads the details of the box
     *
     * Only if you're the creator of the box. Else, you just connect to the jukeboxService and get the box from there
     * TODO: Restrict to creator of the box
     *
     * @memberof BoxComponent
     */
    loadBox() {
        this.boxService.show(this.token).subscribe(
            (box: Box) => {
                this.box = new Box(box);
                this.jukeboxService.setBox(this.box);
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
    connect() {
        this.jukeboxService.connect(this.token, 'D1JU70').subscribe(
            message => {
                console.log('connected', message);
                // Dirty, to be changed
                if (_.has(message, 'link')) {
                    this.currentVideo = message; // Given to the player by 1-way binding
                }
            },
            error => {
                console.error(error);
            }
        );
    }


    /**
     * Actions when the player changes state
     *
     * @param {*} event
     * @memberof BoxComponent
     */
    onPlayerStateChange(event: any) {
        console.log('PLAYER STATE CHANGE', event);
        if (event === 0) {
            this.jukeboxService.next();
        }
    }
}
