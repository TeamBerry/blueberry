import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BoxService } from 'app/shared/services/box.service';
import { Invite } from 'app/shared/models/invite.model';

@Component({
  selector: 'app-invite-form',
  templateUrl: './invite-form.component.html',
    styleUrls: ['./invite-form.component.scss'],
  providers: [BoxService]
})
export class InviteFormComponent implements OnInit {
    @Input() boxToken: string;
    invite: Invite = null;
    expiration = '900';
    fullLink = 'berrybox.tv/invite/';

    constructor(
        public boxService: BoxService,
      public activeModal: NgbActiveModal
    ) { }


    ngOnInit() {

    }

    generateInvite() {
        this.boxService.generateInvite(this.boxToken, parseInt(this.expiration, 10)).subscribe(
            (invite: Invite) => {
                this.invite = invite;
                this.fullLink += invite.link;
            }
        )
    }

}
