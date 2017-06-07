import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BoxFormComponent } from 'app/components/box-form/box-form.component';

@Component({
    selector: 'app-berrybox-nav',
    templateUrl: './berrybox-nav.component.html',
    styleUrls: ['./berrybox-nav.component.scss']
})
export class BerryboxNavComponent implements OnInit {

    constructor(private modalService: NgbModal) { }

    ngOnInit() {
    }

    openCreateModal() {
        const modalRef = this.modalService.open(BoxFormComponent);
        modalRef.componentInstance.title = 'Create a box';
    }

}
