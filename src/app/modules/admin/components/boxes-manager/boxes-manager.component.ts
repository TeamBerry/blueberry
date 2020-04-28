import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import * as moment from 'moment';

import { UserService } from 'app/shared/services/user.service';
import { AuthService } from 'app/core/auth/auth.service';
import { User } from 'app/shared/models/user.model';
import { Box } from 'app/shared/models/box.model';
import { BoxFormComponent } from 'app/shared/components/box-form/box-form.component';
import { BoxService } from 'app/shared/services/box.service';
import { AuthSubject } from 'app/shared/models/session.model';
import { JukeboxService } from 'app/modules/jukebox/jukebox.service';

@Component({
    selector: 'app-boxes-manager',
    templateUrl: './boxes-manager.component.html',
    styleUrls: ['./boxes-manager.component.scss'],
    providers: [BoxService]
})
export class BoxesManagerComponent implements OnInit {
    user: AuthSubject = AuthService.getAuthSubject();

    public boxes: Array<Box>;
    selectedBox: Box = null;

    lifetime = null;
    clockInterval;

    users: number;

    constructor(
        private boxService: BoxService,
        private jukeboxService: JukeboxService,
        private modalService: NgbModal,
        private userService: UserService,
    ) {

    }

    ngOnInit() {
        this.loadBoxes();
    }

    loadBoxes() {
        this.userService.boxes(this.user).subscribe(
            (boxes: Array<Box>) => {
                this.boxes = boxes;

                if (!this.selectedBox && boxes.length > 0) {
                    this.selectBox(boxes[0]._id);
                }
            }
        );
    }

    openCreateModal() {
        const modalRef = this.modalService.open(BoxFormComponent);
        modalRef.componentInstance.title = 'Create a box';
    }

    selectBox(boxId: string) {
        if (!this.selectedBox || this.selectedBox._id !== boxId) {
            clearInterval(this.clockInterval);
            this.selectedBox = this.boxes.find((box: Box) => box._id === boxId)
            this.setupClock(this.selectedBox.createdAt)
            this.jukeboxService.startBox(this.selectedBox)
            this.boxService.users(boxId).subscribe(
                (users) => {
                    this.users = users.length;
                }
            )
        }
    }

    setupClock(startTime: Date) {
        console.log(startTime);
        let life = Math.floor((Date.now() - Date.parse(startTime.toString())) / 1000);
        this.displayClock(life);

        this.clockInterval = setInterval(() => {
            life++;
            this.displayClock(life);
        }, 1000);
    }

    displayClock(time: number) {
        let computedDuration = `PT`

        const years = Math.floor(time / 31557600);
        if (years > 0) {
            computedDuration += `${years}Y`
        }

        const days = Math.floor((time - (years * 31557600)) / 86400);
        if (days > 0 || years !== 0) {
            computedDuration += `${days}D`
        }

        const hours = Math.floor((time - (years * 31557600) - (days * 86400)) / 3600);
        if (hours > 0 || days !== 0 || years !== 0) {
            computedDuration += `${hours}H`
        }

        const mins = Math.floor((time - (years * 31557600) - (days * 86400) - (hours * 3600)) / 60);
        if (mins > 0 || hours !== 0 || days !== 0 || years !== 0) {
            computedDuration += `${mins}M`
        }

        const seconds = time - (years * 31557600) - (days * 86400) - (hours * 3600) - (mins * 60);
        computedDuration += `${seconds}S`

        this.lifetime = computedDuration;

    }
}
