import { Component, OnInit, ViewChild } from '@angular/core';
import { BoxService } from './../../../../shared/services/box.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';

import { MoodWidgetComponent } from './../../components/mood-widget/mood-widget.component';
import { PlayerService } from './../../../../shared/services/player.service';

@Component({
    selector: 'app-box',
    templateUrl: './box.component.html',
    styleUrls: ['./box.component.scss'],
    providers: [BoxService]
})
export class BoxComponent implements OnInit {
    token: string;
    title: string;
    box;
    adminData;
    adminStats;
    userList;
    loading = true;
    loadingData = true;
    loadingStats = true;
    currentVideo = null;
    ready = false;
    @ViewChild(MoodWidgetComponent) private moodWidgetComponent: MoodWidgetComponent;

    constructor(
        private boxService: BoxService,
        private playerService: PlayerService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        this.route.params.subscribe(
            params => {
                this.token = params.token;
                this.loadBox();
            }
        )
    }

    loadBox() {
        this.loading = true;
        this.boxService.show(this.token).subscribe(
            data => {
                this.box = data;
                this.loading = false;
            }
        );
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

    updateVideoInfo(data) {
        this.currentVideo = data;
        /*         if (this.moodWidgetComponent) {
                    this.moodWidgetComponent.checkVote();
                } */
    }
}
