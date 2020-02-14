import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

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
        private userService: UserService,
        private toastr: ToastrService
    ) { }

    ngOnInit() {
        this.favorites$ = this.userService.favorites();
    }

    refresh() {
        this.toastr.success('The video has been removed from your favorites', 'Success');
        this.favorites$ = this.userService.favorites(true);
    }

}
