import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { UserService } from 'app/shared/services/user.service';
import { User } from 'app/shared/models/user.model';

@Component({
    selector: 'app-favorites-tab',
    templateUrl: './favorites-tab.component.html',
    styleUrls: ['./favorites-tab.component.scss']
})
export class FavoritesTabComponent implements OnInit {

    public favorites$: Observable<User['favorites']> = null;

    constructor(
        private userService: UserService
    ) { }

    ngOnInit() {
        this.favorites$ = this.userService.favorites();
    }

}
