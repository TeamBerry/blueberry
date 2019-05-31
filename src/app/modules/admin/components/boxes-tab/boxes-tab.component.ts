import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { UserService } from 'app/shared/services/user.service';
import { AuthService } from 'app/core/auth/auth.service';
import { User } from 'app/shared/models/user.model';
import { Box } from 'app/shared/models/box.model';
import { BoxFormComponent } from 'app/shared/components/box-form/box-form.component';
import { BoxService } from 'app/shared/services/box.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-boxes-tab',
    templateUrl: './boxes-tab.component.html',
    styleUrls: ['./boxes-tab.component.scss'],
    providers: [UserService, BoxService]
})
export class BoxesTabComponent implements OnInit {
    public user: User = AuthService.getSession();

    public boxes: Observable<Array<Box>>;

    constructor(
        private boxService: BoxService,
        private modalService: NgbModal,
        private userService: UserService,
        private toastr: ToastrService
    ) {

    }

    ngOnInit() {
        console.log('INIT', this.user);

        this.boxes = this.userService.boxes(this.user);
    }

    openCreateModal(box?: Box) {
        const modalRef = this.modalService.open(BoxFormComponent);
        modalRef.componentInstance.title = !box ? 'Create a box' : `Edit ${box.name}`;
        modalRef.componentInstance.box = box;
    }

    /**
     * Closes a box.
     *
     * @param {Box} box The box to close
     * @memberof BoxesTabComponent
     */
    closeBox(box: Box) {
        this.boxService.close(box).subscribe(
            (updatedBox) => {
                box.open = false;
                this.toastr.success('The box has been closed succesfully. Video play and submission have been disabled.', 'Success');
            }
        );
    }

}
