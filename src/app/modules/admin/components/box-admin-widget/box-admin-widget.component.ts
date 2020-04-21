import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';

import { Box } from 'app/shared/models/box.model';
import { QueueVideo } from 'app/shared/models/playlist-video.model';
import { BoxService } from 'app/shared/services/box.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BoxFormComponent } from 'app/shared/components/box-form/box-form.component';

@Component({
    selector: 'app-box-admin-widget',
    templateUrl: './box-admin-widget.component.html',
    styleUrls: ['./box-admin-widget.component.scss']
})
export class BoxAdminWidgetComponent implements OnInit {
    @Input() box: Box
    @Output() refresh: EventEmitter<any> = new EventEmitter()
    currentVideo: QueueVideo = null

    constructor(
        private boxService: BoxService,
        private modalService: NgbModal,
        private toastr: ToastrService
    ) { }

    ngOnInit() {
        this.currentVideo = _.find(this.box.playlist, (video) => {
            return video.startTime !== null && video.endTime === null;
        });
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
     * @memberof BoxesManagerComponent
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
     * @memberof BoxesManagerComponent
     */
    deleteBox(box: Box) {
        if (box.open) {
            this.toastr.error('The box is still open and cannot be deleted. Please close the box before deleting it.');
            return;
        }
        this.boxService.delete(box._id).subscribe(
            (deletedBox) => {
                this.toastr.success('The box has been deleted successfully.');
                this.refresh.emit();
            }
        )
    }

}
