import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../core/auth/auth.service';

import { User } from '../../../shared/models/user.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Session } from 'app/shared/models/session.model';

@Component({
    selector: 'app-signup-form',
    templateUrl: './signup-form.component.html',
    styleUrls: ['./signup-form.component.scss']
})
export class SignupFormComponent implements OnInit {
    user: User = new User();

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
                Validators.minLength(4),
                Validators.maxLength(20),
                this.noWhitespaceValidator
            ]),
            mail: new FormControl('', [
                Validators.required,
                Validators.email,
                this.noWhitespaceValidator
            ]),
            password: new FormControl('', [
                Validators.required,
                Validators.minLength(8)
            ]),
            passwordVerify: new FormControl('', [
                Validators.required,
                Validators.minLength(8),
            ])
        })
    }

    get username() {
        return this.signupForm.get('username');
    }

    get mail() {
        return this.signupForm.get('mail');
    }

    get password() {
        return this.signupForm.get('password');
    }

    get passwordVerify() {
        return this.signupForm.get('passwordVerify');
    }

    public noWhitespaceValidator(control: FormControl) {
        return /[\s]+/gmi.test(control.value) ? { whitespace: true } : null;
    }

    /**
     * Checks if the password verification input has the same value as the password input
     *
     * @returns Result of the check
     * @memberof SignupFormComponent
     */
    passwordMatchVerify(): boolean {
        return (this.signupForm.value.password === this.signupForm.value.passwordVerify);
    };

    signup() {
        this.errorMessage = null;
        if (!this.passwordMatchVerify()) {
            this.errorMessage = 'Your password verification is invalid.';
            return;
        }

        const mail = this.signupForm.value.mail.trim();
        const password = this.signupForm.value.password.trim();
        const username = this.signupForm.value.username.trim();

        this.authService.signup(mail, password, username).subscribe(
            (session: Session) => {
                this.authService.setSession(session);
                location.reload();
            },
            (error) => {
                this.errorMessage = 'This email address is already taken. Have you forgotten your password?';
            }
        )
    }

}
