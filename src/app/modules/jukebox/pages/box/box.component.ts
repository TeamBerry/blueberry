import { Component, OnInit, ViewChild } from '@angular/core';
import { BoxService } from './../../../../shared/services/box.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';

import { MoodWidgetComponent } from './../../components/mood-widget/mood-widget.component';
import { PlayerService } from './../../../../shared/services/player.service';
import { JukeboxService } from './../../jukebox.service';
import { Box } from 'app/shared/models/box.model';

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
    box: any;

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
     * Integration of the Mood Widget component, though I'm not sure I need it anymore
     *
     * @private
     * @type {MoodWidgetComponent}
     * @memberof BoxComponent
     */
    @ViewChild(MoodWidgetComponent) private moodWidgetComponent: MoodWidgetComponent;

    constructor(
        private boxService: BoxService,
        private jukeboxService: JukeboxService,
        private playerService: PlayerService,
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
    }

    /**
     * Loads the details of the box
     *
     * @memberof BoxComponent
     */
    loadBox() {
        this.boxService.show(this.token).subscribe(
            data => {
                this.box = new Box(data);
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
        this.playerService.connect(this.token, 'D1JU70').subscribe(
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
}
