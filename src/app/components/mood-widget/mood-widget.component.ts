import { Component, OnInit, Input } from '@angular/core';
import { MoodService } from 'app/services/mood.service';

@Component({
    selector: 'app-mood-widget',
    templateUrl: './mood-widget.component.html',
    styleUrls: ['./mood-widget.component.scss'],
    providers: [MoodService]
})
export class MoodWidgetComponent implements OnInit {
    @Input() currentVideo: number;
    currentVote = null;

    constructor(
        public moodService: MoodService
    ) { }

    ngOnInit() {
        this.checkVote();
    }

    checkVote() {
        const vote = {
            user_token: 'D1JU70',
            video_index: this.currentVideo
        };
        this.moodService.checkVote(vote).subscribe(
            response => {
                this.currentVote = response;
            }
        );
    }

    addVote() {
        const vote = {
            vote_mood: 1,
            user_token: 'D1JU70',
            video_index: this.currentVideo
        };
        this.moodService.likeVideo(vote).subscribe(
            response => {
                vote['vote_id'] = response;
                this.currentVote = vote;
            }
        );
    }

    removeVote(id: number) {
        this.moodService.unlikeVideo(id).subscribe(
            response => {
                this.currentVote = null;
            }
        );
    }

    requestSkip() {

    }

}
