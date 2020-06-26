import { Component, OnInit, Input } from '@angular/core';

import { BoxService } from 'app/shared/services/box.service';
import { Box } from 'app/shared/models/box.model';
import { JukeboxService } from '../../jukebox.service';
import { ActiveSubscriber, Role, BoxScope } from '@teamberry/muscadine';
import { AuthSubject } from 'app/shared/models/session.model';
import { RoleChangeRequest } from 'app/shared/models/role-change.model';

@Component({
    selector: 'app-userlist',
    templateUrl: './userlist.component.html',
    styleUrls: ['./userlist.component.scss'],
    providers: [BoxService]
})
export class UserlistComponent implements OnInit {
    box: Box;
    @Input() user: AuthSubject;

    admin: ActiveSubscriber
    moderators: Array<ActiveSubscriber> = []
    vips: Array<ActiveSubscriber> = []
    community: Array<ActiveSubscriber> = []

    constructor(
        private jukeboxService: JukeboxService,
        private boxService: BoxService
    ) { }

    ngOnInit() {
        this.jukeboxService.getBox().subscribe(
            (box: Box) => {
                this.box = box
                this.getCommunity()
            }
        )
    }

    getCommunity() {
        this.boxService.users(this.box._id).subscribe(
            (subscribers) => {
                this.admin = subscribers.find((subscriber) => subscriber._id === this.box.creator._id)
                this.moderators = subscribers.filter((subscriber) => subscriber.role === 'moderator')
                this.vips = subscribers.filter((subscriber) => subscriber.role === 'vip')
                this.community = subscribers.filter((subscriber) => subscriber.role === 'simple')
            }
        )
    }

    changeRole(target: string, role: Role) {
        const roleChangeRequest: RoleChangeRequest = {
            scope: {
                userToken: target,
                boxToken: this.box._id
            },
            role,
            source: this.user._id
        }

        this.jukeboxService.changeRoleOfUser(roleChangeRequest)
    }

}
