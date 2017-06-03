import { Component, OnInit, ViewChild } from '@angular/core';
import { MoodService } from 'app/services/mood.service';
import { UserService } from 'app/services/user.service';
import { BoxService } from 'app/services/box.service';
import { PlayerService } from 'app/services/player.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { MoodWidgetComponent } from './../mood-widget/mood-widget.component';

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
        this.token = route.snapshot.paramMap.get('token');
    }

    ngOnInit() {
        console.log("Init box...")
        this.boxService.get(this.token).subscribe(
            data => {
                this.box = data;
                this.loading = false;
                console.log("Box found.", this.box);
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
