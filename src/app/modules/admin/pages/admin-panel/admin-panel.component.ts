import { Component, OnInit } from '@angular/core';

import { User } from 'app/shared/models/user.model';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
    selector: 'app-admin-panel',
    templateUrl: './admin-panel.component.html',
    styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {
    public user: User = AuthService.getSession()
    public currentTab = 'boxes';

    constructor() { }

    ngOnInit() {
    }

}
