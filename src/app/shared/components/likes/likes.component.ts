import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { MoodService } from '../../services/mood.service';
import * as _ from 'lodash';

@Component({
    selector: 'app-likes',
    templateUrl: './likes.component.html',
    styleUrls: ['./likes.component.scss'],
    providers: [UserService, MoodService]
})
export class LikesComponent implements OnInit {
    loading: true;
    likes;

    constructor(
        private userService: UserService,
        private moodService: MoodService
    ) { }

    ngOnInit() {
        this.loadLikes();
    }

    loadLikes() {
        this.loading = true;
        // TODO: Fetch likes
    }

    removeVote(id: number) {
        // TODO: Remove vote
    }

}
