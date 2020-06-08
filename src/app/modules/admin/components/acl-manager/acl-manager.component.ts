import { Component, OnInit } from '@angular/core';
import { User } from 'app/shared/models/user.model';
import { UserService } from 'app/shared/services/user.service';
import { AuthSubject } from 'app/shared/models/session.model';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
    selector: 'app-acl-manager',
    templateUrl: './acl-manager.component.html',
    styleUrls: ['./acl-manager.component.scss']
})
export class AclManagerComponent implements OnInit {
    public session: AuthSubject = AuthService.getAuthSubject();
    public userACLConfig: User['acl'];

    constructor(
        private userService: UserService
    ) { }

    ngOnInit() {
        this.userService.show(this.session._id).subscribe(
            (user: User) => {
                this.userACLConfig = user.acl;
            }
        )
    }

    saveACL() {
        this.userService.updateACL(this.userACLConfig).subscribe(
            () => {
                console.log('SAVED')
            }
        )
    }

}
