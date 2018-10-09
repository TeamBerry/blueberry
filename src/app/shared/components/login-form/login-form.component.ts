import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from '../../../core/auth/auth.service';

@Component({
    selector: 'app-login-form',
    templateUrl: './login-form.component.html',
    styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent implements OnInit {
    loginForm: FormGroup;

    constructor(
        public activeModal: NgbActiveModal,
        public authService: AuthService,
    ) {
    }

    ngOnInit(): void {
        this.loginForm = new FormGroup({
            mail: new FormControl('', [Validators.required]),
            password: new FormControl('', [Validators.required])
        });
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
            (authResult) => {
                this.authService.setSession(authResult);
                location.reload();
            }
        );
    }
}
