import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../core/auth/auth.service';

import { User } from '../../../shared/models/user.model';
import { FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';

@Component({
    selector: 'app-signup-form',
    templateUrl: './signup-form.component.html',
    styleUrls: ['./signup-form.component.scss']
})
export class SignupFormComponent implements OnInit {
    user: User = new User;

    errorMessage: string = null;
    signupForm: FormGroup;

    constructor(
        public activeModal: NgbActiveModal,
        public authService: AuthService
    ) { }

    ngOnInit(): void {
        this.signupForm = new FormGroup({
            username: new FormControl('', [
                Validators.required,
                Validators.minLength(6)
            ]),
            mail: new FormControl('', [Validators.required]),
            password: new FormControl('', [
                Validators.required,
                Validators.minLength(8)
            ]),
            passwordVerify: new FormControl('', [
                Validators.required,
                Validators.minLength(8)
            ])
        })
    }

    get username() { return this.signupForm.get('username'); }
    get mail() { return this.signupForm.get('mail'); }
    get password() { return this.signupForm.get('password'); }
    get passwordVerify() { return this.signupForm.get('passwordVerify'); }

    /**
     * Checks if the password verification input has the same value as the password input
     *
     * @returns {boolean} Result of the check
     * @memberof SignupFormComponent
     */
    passwordMatchVerify(): boolean {
        return (this.signupForm.value.password === this.signupForm.value.passwordVerify);
    };

    signup() {

        if (!this.passwordMatchVerify()) {
            this.errorMessage = 'Your password verification is invalid';
            return;
        }

        const mail = this.signupForm.value.mail,
            password = this.signupForm.value.password,
            username = this.signupForm.value.username;

        this.authService.signup(mail, password, username).subscribe(
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
