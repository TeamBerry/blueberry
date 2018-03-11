import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Box } from '../../models/box.model';
import { BoxFormComponent } from './../box-form/box-form.component';
import { BoxService } from './../../services/box.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    providers: [BoxService]
})
export class HomeComponent implements OnInit {
    title = 'YouTube. With everyone.';
    boxes: Box[] = [];
    loading = true;

    constructor(public router: Router,
        private modalService: NgbModal,
        public boxService: BoxService) { }

    ngOnInit() {
        this.boxService.list().subscribe(
            boxes => {
                this.boxes = boxes;
                this.loading = false;
            },
            error => console.log(error)
        );
    }

    /**
     * When the user clicks on the widget box, he enters the box
     *
     * @param {string} token The Mongo _id of the box
     * @memberof HomeComponent
     */
    enter(token: string) {
        this.router.navigate(['box/', token]);
    }

    openCreateModal() {
        const modalRef = this.modalService.open(BoxFormComponent);
        modalRef.componentInstance.title = 'Create a box';
    }
}
