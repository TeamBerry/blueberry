import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-login-form',
    templateUrl: './login-form.component.html',
    styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

    constructor(
        public activeModal: NgbActiveModal
    ) { }

    ngOnInit() {
    }

    onSubmit(){
        console.log('attempting to log in...');
    }

}
