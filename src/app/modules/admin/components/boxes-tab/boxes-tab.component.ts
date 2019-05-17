import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { UserService } from 'app/shared/services/user.service';
import { AuthService } from 'app/core/auth/auth.service';
import { User } from 'app/shared/models/user.model';
import { Box } from 'app/shared/models/box.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BoxFormComponent } from 'app/shared/components/box-form/box-form.component';

@Component({
    selector: 'app-boxes-tab',
    templateUrl: './boxes-tab.component.html',
    styleUrls: ['./boxes-tab.component.scss'],
    providers: [UserService]
})
export class BoxesTabComponent implements OnInit {
    public user: User = AuthService.getSession();

    public boxes: Observable<Array<Box>>;

    constructor(
        private modalService: NgbModal,
        private userService: UserService
    ) {

    }

    ngOnInit() {
        console.log('INIT', this.user);

        this.boxes = this.userService.boxes(this.user);
    }

    openCreateModal(box?: Box) {
        const modalRef = this.modalService.open(BoxFormComponent);
        modalRef.componentInstance.title = !box ? 'Create a box' : `Edit ${box.name}`;
    }

}
