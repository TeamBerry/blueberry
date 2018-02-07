import { Component, OnInit } from '@angular/core';
import { UserService } from './../../../../shared/services/user.service';

@Component({
    selector: 'app-favoritelist',
    templateUrl: './favoritelist.component.html',
    styleUrls: ['./favoritelist.component.scss'],
    providers: [UserService]
})
export class FavoritelistComponent implements OnInit {
    likes;

    constructor(
        private userService: UserService
    ) { }

    ngOnInit() {
        this.fetchLikes();
    }

    fetchLikes() {
        this.userService.likes('D1JU70').subscribe(
            data => {
                this.likes = data;
            }
        );
    }

}
