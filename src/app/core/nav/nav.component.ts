import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BoxFormComponent } from '../../shared/components/box-form/box-form.component';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

    constructor(private modalService: NgbModal) { }

    ngOnInit() {
    }

    openCreateModal() {
        const modalRef = this.modalService.open(BoxFormComponent);
        modalRef.componentInstance.title = 'Create a box';
    }

}
