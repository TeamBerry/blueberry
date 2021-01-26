import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

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
export class UserlistComponent implements OnInit {
    @Input() box: Box;
    @Input() user: AuthSubject;
    @Input() permissions: Array<Permission> = [];

    users: Array<{ title: string, icon: string, context: Exclude<Role, 'admin'>, list: Array<ActiveSubscriber> }> = [
        {
            title: 'Creator',
            icon: '../../../../../assets/images/badges/creator-badge.png',
            context: null,
            list: []
        },
        {
            title: 'Moderators',
            icon: '../../../../../assets/images/badges/moderator-badge.png',
            context: 'moderator',
            list: []
        },
        {
            title: 'VIPs',
            icon: '../../../../../assets/images/badges/vip-badge.png',
            context: 'vip',
            list: []
        },
        {
            title: 'Community Members',
            icon: null,
            context: 'simple',
            list: []
        }
    ]

    @ViewChild('filterInput') input: ElementRef;
    filterValue = '';

    constructor(
        private jukeboxService: JukeboxService,
        private boxService: BoxService,
        private modalService: NgbModal
    ) { }

    ngOnInit() {
        this.getCommunity()
    }

    getCommunity() {
        this.boxService.users(this.box._id).subscribe(
            (subscribers) => {
                this.users[0].list = subscribers.filter((subscriber) => subscriber._id === this.box.creator._id);
                this.users[1].list = subscribers.filter((subscriber) => subscriber.role === 'moderator');
                this.users[2].list = subscribers.filter((subscriber) => subscriber.role === 'vip');
                this.users[3].list = subscribers.filter((subscriber) => subscriber.role === 'simple');
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
