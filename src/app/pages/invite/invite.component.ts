import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environment';

import { Invite } from 'app/shared/models/invite.model';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss']
})
export class InviteComponent implements OnInit {
    inviteToken: string;
    isInviteInvalid = false;

    constructor(
        private http: HttpClient,
        private route: ActivatedRoute,
        public router: Router
    ) { }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.inviteToken = params.link
            this.checkInvite();
        })
    }

    checkInvite() {
        this.http.get(`${environment.araza}/invites/${this.inviteToken}`).subscribe(
            (invite: Invite) => {
                this.router.navigate(['box/', invite.boxToken])
            },
            (error: HttpErrorResponse) => {
                this.isInviteInvalid = true;
            }
        )
    }

}
