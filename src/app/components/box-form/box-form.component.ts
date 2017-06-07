import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Box } from './../../box';
import { BoxService } from './../../services/box.service';

import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-box-form',
    templateUrl: './box-form.component.html',
    styleUrls: ['./box-form.component.scss']
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

    model = new Box('', '', '', this.langs[0]);

    constructor(public activeModal: NgbActiveModal) { }

    ngOnInit() {
    }

    onSubmit() {
        this.submitted = true;
    }
}
