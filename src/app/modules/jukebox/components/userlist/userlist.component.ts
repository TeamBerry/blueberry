import { Component, OnInit, Input } from '@angular/core';

import { User } from 'app/shared/models/user.model';

@Component({
    selector: 'app-userlist',
    templateUrl: './userlist.component.html',
    styleUrls: ['./userlist.component.scss']
})
export class UserlistComponent implements OnInit {
    @Input() boxToken: string;
    @Input() user: User;

    constructor() { }

    ngOnInit() {
    }

}
