import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-favoritelist',
    templateUrl: './favoritelist.component.html',
    styleUrls: ['./favoritelist.component.scss'],
})
export class FavoritelistComponent implements OnInit {
    likes;

    constructor(
    ) { }

    ngOnInit() {
    }

    fetchLikes() {
        // TODO:
    }

}
