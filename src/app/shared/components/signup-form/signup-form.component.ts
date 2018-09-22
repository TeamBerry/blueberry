import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../core/auth/auth.service';

import { User } from '../../../shared/models/user.model';

@Component({
    selector: 'app-signup-form',
    templateUrl: './signup-form.component.html',
    styleUrls: ['./signup-form.component.scss']
})
export class SignupFormComponent implements OnInit {
    user: User = new User;
    username: string;
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
        // TODO: Check email

        // Check password verify
        if (this.password !== this.passwordVerify) {
            this.errorMessage = 'Your password verification is invalid.';
        } else {
            this.signup();
        }
    }

    signup() {
        console.log('signup');
        this.authService.signup(this.mail, this.password).subscribe(
            (authResult) => {
                this.authService.setSession(authResult);
                location.reload();
            },
            (error) => {
                this.errorMessage = 'This email address is already taken. Have you forgotten your password?';
                console.log(error);
            }
        )
    }

}
