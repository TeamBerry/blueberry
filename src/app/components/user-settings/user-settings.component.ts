import { Component, OnInit, EventEmitter, Input } from '@angular/core';

import { User } from '../../shared/models/user.model';

@Component({
    selector: 'app-user-settings',
    templateUrl: './user-settings.component.html',
    styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit {

    public currentTab = 'account';
    @Input() user: User;

    public close: EventEmitter<any> = new EventEmitter();

    constructor() { }

    ngOnInit() {
        console.log(this.user);
    }

    closeSettings() {
        this.close.emit();
    }

}
