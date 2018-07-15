import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

import { MoodService } from './../../../../shared/services/mood.service';

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
        // TODO: Should compare against the array of moods...
    }

    addVote() {
        const vote = {
            vote_mood: 1,
            user_token: 'D1JU70',
            video_index: this.currentVideo
        };
        // TODO: Like video
    }

    removeVote(id: number) {
        // TODO: Unlike video
    }

    requestSkip() {

    }

}
