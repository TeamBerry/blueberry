import { Component, OnInit } from '@angular/core';
import { MoodService } from 'app/services/mood.service';
import { UserService } from 'app/services/user.service';
import { BoxService } from 'app/services/box.service';
import { PlayerService } from 'app/services/player.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

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

    constructor(
        private boxService: BoxService,
        private userService: UserService,
        private playerService: PlayerService,
        private moodService: MoodService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.token = route.snapshot.paramMap.get('token');
        console.log(this.token);
    }

    ngOnInit() {
        this.boxService.get(this.token).subscribe(
            data => {
                this.box = data;
                console.log(this.box);
                this.loading = false;
            }
        )
    }

}
