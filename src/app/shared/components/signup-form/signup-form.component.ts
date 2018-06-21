import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
    selector: 'app-signup-form',
    templateUrl: './signup-form.component.html',
    styleUrls: ['./signup-form.component.scss']
})
export class SignupFormComponent implements OnInit {
    mail: string;
    password: string;
    passwordVerify: string;

    errorMessage: string = null;

    constructor(
        public activeModal: NgbActiveModal,
        public authService: AuthService
    ) { }

    ngOnInit() {
    }

    onSubmit() {
        console.log('attempting to signup...');
        if (this.password !== this.passwordVerify) {
            this.errorMessage = 'Your password verification is invalid.';
        }
    }

    signup() {
        this.authService.signup(this.mail, this.password).subscribe(
            (authResult) => {
                this.authService.setSession(authResult);
                location.reload();
            },
            (error) => {
                console.log(error);
            }
        )
    }

}
