import { Component, Input, ViewChild, ElementRef, OnChanges } from '@angular/core';

import { BoxService } from 'app/shared/services/box.service';
import { Box } from 'app/shared/models/box.model';
import { JukeboxService } from '../../jukebox.service';
import { ActiveSubscriber, Role, Permission } from '@teamberry/muscadine';
import { AuthSubject } from 'app/shared/models/session.model';
import { RoleChangeRequest } from 'app/shared/models/role-change.model';
import { InviteFormComponent } from 'app/shared/components/invite-form/invite-form.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, tap } from 'rxjs/operators';

@Component({
    selector: 'app-userlist',
    templateUrl: './userlist.component.html',
    styleUrls: ['./userlist.component.scss'],
    providers: [BoxService]
})
export class UserlistComponent implements OnChanges {
    @Input() box: Box;
    @Input() user: AuthSubject;
    @Input() permissions: Array<Permission> = [];

    @ViewChild('filterInput') input: ElementRef;

    users: Array<{
        title: string, icon: string, context: Exclude<Role, 'admin'>, actionsDisplayed: boolean, list: Array<ActiveSubscriber>
    }> = [
        {
            title: 'Creator',
            icon: '../../../../../assets/images/badges/creator-badge.png',
            context: null,
            actionsDisplayed: false,
            list: []
        },
        {
            title: 'Moderators',
            icon: '../../../../../assets/images/badges/moderator-badge.png',
            context: 'moderator',
            actionsDisplayed: false,
            list: []
        },
        {
            title: 'VIPs',
            icon: '../../../../../assets/images/badges/vip-badge.png',
            context: 'vip',
            actionsDisplayed: false,
            list: []
        },
        {
            title: 'Community Members',
            icon: null,
            context: 'simple',
            actionsDisplayed: false,
            list: []
        }
    ]

    filterValue = '';

    constructor(
        private jukeboxService: JukeboxService,
        private boxService: BoxService,
        private modalService: NgbModal
    ) { }

    ngOnChanges() {
        // Triggered on changes so that when permissions changed, the UI is refreshed
        this.getCommunity()
    }

    getCommunity() {
        this.boxService.users(this.box._id).subscribe(
            (subscribers) => {
                this.users[0].list = subscribers.filter((subscriber) => subscriber._id === this.box.creator._id);

                // Handling Moderators
                this.users[1].list = subscribers.filter((subscriber) => subscriber.role === 'moderator');
                this.users[1].actionsDisplayed = this.permissions.includes('setModerator')

                // Handling VIPs
                this.users[2].list = subscribers.filter((subscriber) => subscriber.role === 'vip');
                this.users[2].actionsDisplayed = (['setVIP', 'unsetVIP'] as Array<Permission>).some(p => this.permissions.includes(p))

                // Handling Community
                this.users[3].list = subscribers.filter((subscriber) => subscriber.role === 'simple');
                this.users[3].actionsDisplayed = (['setModerator', 'setVIP'] as Array<Permission>).some(p => this.permissions.includes(p))

                setTimeout(() => {
                    this.bindSearch();
                }, 2000)
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
        setTimeout(() => {
            this.getCommunity()
        }, 4000);
    }

    openInviteModal() {
        const modalRef = this.modalService.open(InviteFormComponent)
        modalRef.componentInstance.boxToken = this.box._id
    }

    bindSearch() {
        fromEvent(this.input.nativeElement, 'keyup')
            .pipe(
                filter(Boolean),
                debounceTime(500),
                distinctUntilChanged(),
                tap(() => {
                    this.filterValue = this.input.nativeElement.value
                })
            )
            .subscribe()
    }

    resetFilter() {
        this.filterValue = ''
        this.input.nativeElement.value = ''
    }
}
