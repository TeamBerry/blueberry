import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-signup-form',
    templateUrl: './signup-form.component.html',
    styleUrls: ['./signup-form.component.scss']
})
export class SignupFormComponent implements OnInit {

    constructor(
        public activeModal: NgbActiveModal
    ) { }

    ngOnInit() {
    }

    onSubmit(){
        console.log('attempting to signup...');
    }

}
