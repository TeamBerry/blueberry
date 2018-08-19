import { Component, OnInit, Input } from '@angular/core';

import { User } from 'app/shared/models/user.model';

@Component({
    selector: 'app-favoritelist',
    templateUrl: './favoritelist.component.html',
    styleUrls: ['./favoritelist.component.scss'],
})
export class FavoritelistComponent implements OnInit {
    likes;
    @Input() user: User = new User;

    constructor(
    ) { }

    ngOnInit() {
    }

    fetchLikes() {
        // TODO:
    }

}
