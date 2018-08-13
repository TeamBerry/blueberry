import { Component, OnInit } from '@angular/core';

import { User } from '../../shared/models/user.model';

@Component({
    selector: 'app-user-settings',
    templateUrl: './user-settings.component.html',
    styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit {

    public currentTab = 'account';
    public user: User

    constructor() { }

    ngOnInit() {
        this.user = new User;
        this.user.name = 'AngelZatch';
        this.user.mail = 'angelzatch@gmail.com';
        console.log(this.user);
    }

}
