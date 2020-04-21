import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';

import { UserService } from 'app/shared/services/user.service';
import { AuthService } from 'app/core/auth/auth.service';
import { User } from 'app/shared/models/user.model';
import { Box } from 'app/shared/models/box.model';
import { BoxFormComponent } from 'app/shared/components/box-form/box-form.component';
import { BoxService } from 'app/shared/services/box.service';
import { AuthSubject } from 'app/shared/models/session.model';

@Component({
    selector: 'app-boxes-manager',
    templateUrl: './boxes-manager.component.html',
    styleUrls: ['./boxes-manager.component.scss'],
    providers: [BoxService]
})
export class BoxesManagerComponent implements OnInit {
    user: AuthSubject = AuthService.getAuthSubject();

    public boxes: Observable<Array<Box>>;

    constructor(
        private modalService: NgbModal,
        private userService: UserService,
    ) {

    }

    ngOnInit() {
        this.loadBoxes();
    }

    loadBoxes() {
        this.boxes = this.userService.boxes(this.user);
    }

    openCreateModal() {
        const modalRef = this.modalService.open(BoxFormComponent);
        modalRef.componentInstance.title = 'Create a box';
    }
}
