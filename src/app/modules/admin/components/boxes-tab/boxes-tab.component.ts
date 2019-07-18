import { Component, OnInit } from '@angular/core';
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
     * Toggles the box between open or closed
     *
     * @param {Box} box The box to close
     * @memberof BoxesTabComponent
     */
    toggleBoxState(box: Box) {
        if (box.open) {
            this.boxService.close(box).subscribe(
                (updatedBox) => {
                    box.open = false;
                    this.toastr.success('The box has been closed succesfully. Video play and submission have been disabled.', 'Success');
                }
            );
        } else {
            this.boxService.open(box).subscribe(
                (updatedBox) => {
                    box.open = true;
                    this.toastr.success('The box has been opened succesfully. Video play and submission have been reenabled.', 'Success');
                }
            );
        }
    }

    /**
     * Deletes a closed box
     *
     * @param {Box} box
     * @memberof BoxesTabComponent
     */
    deleteBox(box: Box) {
        if (box.open) {
            this.toastr.error('The box is still open and cannot be deleted. Please close the box before deleting it.');
            return;
        }
        this.boxService.delete(box._id).subscribe(
            (deletedBox) => {
                this.toastr.success('The box has been deleted successfully.');

                // Reload boxes
                this.boxes = this.userService.boxes(this.user);
            }
        )
    }

}
