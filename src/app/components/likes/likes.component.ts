import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-likes',
    templateUrl: './likes.component.html',
    styleUrls: ['./likes.component.scss'],
    providers: [UserService]
})
export class LikesComponent implements OnInit {
    loading: true;
    likes;

    constructor(
        private userService: UserService
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

}
