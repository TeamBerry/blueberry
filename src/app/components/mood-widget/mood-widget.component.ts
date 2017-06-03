import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
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
        console.log('Init mood widget... Input is ', this.currentVideo);
        this.checkVote();
    }

    checkVote() {
        console.log('checking your vote for this video...');
        const vote = {
            user_token: 'D1JU70',
            video_index: this.currentVideo
        };
        this.moodService.checkVote(vote).subscribe(
            response => {
                this.currentVote = response;
                console.log("vote is ", response);
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
