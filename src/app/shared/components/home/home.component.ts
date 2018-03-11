import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { BoxService } from './../../services/box.service';
import { BoxFormComponent } from './../box-form/box-form.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    providers: [BoxService]
})
export class HomeComponent implements OnInit {
    title = 'YouTube. With everyone.';
    boxes;
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

    enter(token: string) {
        this.router.navigate(['box/', token]);
    }

    openCreateModal() {
        const modalRef = this.modalService.open(BoxFormComponent);
        modalRef.componentInstance.title = 'Create a box';
    }
}
