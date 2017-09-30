import { Component, OnInit, ViewChild } from '@angular/core';
import { MoodService } from './../../../../shared/services/mood.service';
import { UserService } from './../../../../shared/services/user.service';
import { BoxService } from './../../../../shared/services/box.service';
import { PlayerService } from './../../../../shared/services/player.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { MoodWidgetComponent } from './../../components/mood-widget/mood-widget.component';

@Component({
    selector: 'app-box',
    templateUrl: './box.component.html',
    styleUrls: ['./box.component.scss'],
    providers: [BoxService, UserService, PlayerService, MoodService]
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
        private userService: UserService,
        private playerService: PlayerService,
        private moodService: MoodService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        route.paramMap.subscribe(
            params => {
                this.token = params.get('token');
                this.loadingBox();
            }
        );
    }

    ngOnInit() {
        this.loadingBox();
    }

    loadingBox() {
        this.loading = true;
        this.boxService.get(this.token).subscribe(
            data => {
                this.box = data;
                this.loading = false;
            }
        );
    }

    updateVideoInfo(data) {
        this.currentVideo = data;
        console.log("Video has been detected.", this.currentVideo);
        if (this.moodWidgetComponent) {
            this.moodWidgetComponent.checkVote();
        }
    }
}
