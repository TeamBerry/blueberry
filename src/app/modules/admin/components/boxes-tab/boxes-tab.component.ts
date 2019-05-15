import { Component, OnInit } from '@angular/core';

import { UserService } from 'app/shared/services/user.service';
import { AuthService } from 'app/core/auth/auth.service';
import { User } from 'app/shared/models/user.model';

@Component({
    selector: 'app-boxes-tab',
    templateUrl: './boxes-tab.component.html',
    styleUrls: ['./boxes-tab.component.scss'],
    providers: [UserService]
})
export class BoxesTabComponent implements OnInit {
    public user: User;

    constructor(
        private authService: AuthService,
        private userService: UserService
    ) {

    }

    ngOnInit() {
        console.log('INIT');
        this.authService.getUser().subscribe(
            (user: User) => {
                this.user = user;
                console.log(this.user);
            }
        )
    }

}
