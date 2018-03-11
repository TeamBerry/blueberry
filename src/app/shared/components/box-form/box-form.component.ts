import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Box } from './../../models/box.model';
import { BoxService } from './../../services/box.service';

@Component({
    selector: 'app-box-form',
    templateUrl: './box-form.component.html',
    styleUrls: ['./box-form.component.scss'],
    providers: [BoxService]
})
export class BoxFormComponent implements OnInit {
    @Input() title;
    boxForm: FormGroup;
    public langs: string[] = [
        'English',
        'Français',
        '日本語',
    ];
    submitted = false;

    box = new Box({
        creator: 'D1JU70',
    });

    constructor(
        public boxService: BoxService,
        public activeModal: NgbActiveModal,
        private router: Router
    ) { }

    ngOnInit() {
    }

    onSubmit() {
        this.submitted = true;
        this.boxService.store(this.box).subscribe(
            data => {
                this.activeModal.close();
                this.router.navigate(['/box/' + data._id]);
            }
        );
    }
}
