import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { filter } from 'rxjs/operators';

import { UserService } from 'app/shared/services/user.service';
import { AuthService } from 'app/core/auth/auth.service';
import { Box } from 'app/shared/models/box.model';
import { BoxFormComponent } from 'app/shared/components/box-form/box-form.component';
import { BoxService } from 'app/shared/services/box.service';
import { AuthSubject } from 'app/shared/models/session.model';
import { JukeboxService } from 'app/modules/jukebox/jukebox.service';
import { PlayingItem, SyncPacket } from '@teamberry/muscadine';

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
    selectedBoxQueueLength: number = 0;

    lifetime = null;
    clockInterval;

    users: number;

    /**
     * The currently playing video in the box. Gets refreshed by sockets and sent to the player and mood widgets
     *
     * @memberof BoxComponent
     */
    currentVideo: PlayingItem = null;

    constructor(
        private boxService: BoxService,
        private jukeboxService: JukeboxService,
        private modalService: NgbModal,
        private userService: UserService,
        private toastr: ToastrService
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

    openCreateModal(box?: Box) {
        const modalRef = this.modalService.open(BoxFormComponent, { size: 'xl' });
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
                const boxIndex = this.boxes.findIndex(item => box._id === item._id)
                this.boxes.splice(boxIndex, 1)

                if (boxIndex === 0) {
                    this.selectBox(this.boxes[0]._id)
                }

                if (boxIndex > this.boxes.length) {
                    this.selectBox(this.boxes[this.boxes.length]._id)
                }

                this.selectBox(this.boxes[boxIndex]._id)
            }
        )
    }

    selectBox(boxId: string) {
        if (!this.selectedBox || this.selectedBox._id !== boxId) {
            // Reset
            this.selectedBox = null;
            clearInterval(this.clockInterval);

            // Restart
            this.selectedBox = this.boxes.find((box: Box) => box._id === boxId)
            this.setupClock(this.selectedBox.createdAt)
            this.jukeboxService.startBox(this.selectedBox)
            this.jukeboxService.getQueueStream().subscribe(
                (queue) => {
                    this.selectedBoxQueueLength = queue.length
                }
            )
            this.boxService.users(boxId).subscribe(
                (users) => {
                    this.users = users.length;
                }
            )
            this.connectToSyncStream();
        }
    }


    /**
     * Actions when the player changes state
     *
     * @param {*} event
     * @memberof BoxComponent
     */
    onPlayerStateChange(event: any) {
        if (event === 'ready') {
            this.connectToSyncStream();
        }
    }

    connectToSyncStream() {
        this.jukeboxService.getBoxStream()
            .pipe(
                filter((syncPacket: SyncPacket) => syncPacket.box === this.selectedBox._id)
            )
            .subscribe(
                (syncPacket: SyncPacket) => {
                    this.currentVideo = syncPacket?.item ?? null;
                }
            )
    }

    setupClock(startTime: Date) {
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

    setDeletionDate(date: Date) {
        return new Date(date).setSeconds(new Date(date).getSeconds() + 604800)
    }
}
