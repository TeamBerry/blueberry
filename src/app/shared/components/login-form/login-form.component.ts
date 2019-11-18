import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from '../../../core/auth/auth.service';
import { Session } from 'app/shared/models/session.model';
import { ThemeService } from 'app/shared/services/theme.service';

@Component({
    selector: 'app-login-form',
    templateUrl: './login-form.component.html',
    styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent implements OnInit {
    loginForm: FormGroup;
    resetForm: FormGroup;

    errorMessage: string = null;

    state: 'login' | 'reset' = 'login';
    isResetDone = false;

    constructor(
        public activeModal: NgbActiveModal,
        public authService: AuthService,
        private themeService: ThemeService
    ) {
    }

    ngOnInit(): void {
        this.loginForm = new FormGroup({
            mail: new FormControl('', [Validators.required]),
            password: new FormControl('', [Validators.required])
        });

        this.resetForm = new FormGroup({
            mail: new FormControl('', [Validators.required])
        })
    }

    get mail() { return this.loginForm.get('mail'); }

    get password() { return this.loginForm.get('password'); }

    /**
     * Sends the form data to the server to attempt connection
     *
     * authResult structure:
     * {
     *  "bearer": JWT,
     *  "expiresIn": validity,
     *  "subject": user
     * }
     *
     * @memberof LoginFormComponent
     */
    login() {
        const mail = this.loginForm.value.mail,
            password = this.loginForm.value.password;
        this.authService.login(mail, password).subscribe(
            (session: Session) => {
                this.errorMessage = null;
                this.authService.setSession(session);
                this.themeService.init();
                location.reload();
            },
            (error) => {
                this.errorMessage = 'Your credentials are invalid. Please try again.';
            }
        );
    }

    resetPassword() {
        this.authService.triggerPasswordReset(this.resetForm.value.mail).subscribe(
            (response) => {
                this.isResetDone = true;

                setTimeout(() => {
                    this.state = 'login'
                }, 5000);
            }
        )
    }
}
