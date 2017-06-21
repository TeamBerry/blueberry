import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { MoodService } from '../../services/mood.service';

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
        this.userService.likes('D1JU70').subscribe(
            data => {
                console.log(data);
                this.likes = data;
            }
        );
    }

    removeVote(id: number){
        this.moodService.unlikeVideo(id).subscribe(
            response => {
                // Search in the array and delete this entry
            }
        )
    }

}
