import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { BoxService } from 'app/shared/services/box.service';
import { Invite } from 'app/shared/models/invite.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-box-join',
  templateUrl: './box-join.component.html',
    styleUrls: ['./box-join.component.scss'],
    providers: [BoxService]
})
export class BoxJoinComponent implements OnInit {
    link: string = null;
    error: string = null;

    constructor(
        public activeModal: NgbActiveModal,
        public boxService: BoxService,
        public router: Router
    ) { }

    ngOnInit() {
    }

    onSubmit() {
        this.error = null;
        const inviteParseResults = /(i|invite)\/(\S{8})/gm.exec(this.link);

        if(!inviteParseResults){
            this.error = 'The link is invalid.';
            return;
        }

        this.boxService.matchInvite(inviteParseResults[2]).subscribe(
            (invite: Invite) => {
                this.router.navigate(['box/', invite.boxToken]);
                this.activeModal.dismiss();
            },
            error => {
                switch (error.error) {
                    case 'INVITE_NOT_FOUND':
                    case 'INVITE_EXPIRED':
                        this.error = 'This invite has expired.';
                        break;

                    case 'BOX_NOT_FOUND':
                        this.error = 'This invite is invalid';
                        break;

                    case 'BOX_CLOSED':
                        this.error = 'This box is closed and cannot be accessed';
                        break;

                    default:
                        this.error = 'This invite is invalid';
                }
            }
        )
    }

}
