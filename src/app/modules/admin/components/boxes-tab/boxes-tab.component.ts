import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { UserService } from 'app/shared/services/user.service';
import { AuthService } from 'app/core/auth/auth.service';
import { User } from 'app/shared/models/user.model';
import { Box } from 'app/shared/models/box.model';

@Component({
    selector: 'app-boxes-tab',
    templateUrl: './boxes-tab.component.html',
    styleUrls: ['./boxes-tab.component.scss'],
    providers: [UserService]
})
export class BoxesTabComponent implements OnInit {
    public user: User = AuthService.getSession();

    public boxes: Observable<Array<Box>>;

    constructor(
        private userService: UserService
    ) {

    }

    ngOnInit() {
        console.log('INIT', this.user);

        this.boxes = this.userService.boxes(this.user);
    }

}
