import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AuthService } from '../../../core/auth/auth.service';

@Component({
    selector: 'app-login-form',
    templateUrl: './login-form.component.html',
    styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent implements OnInit {
    mail: string;
    password: string;

    constructor(
        public activeModal: NgbActiveModal,
        public authService: AuthService
    ) {
    }

    ngOnInit() {
    }

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
        this.authService.login(this.mail, this.password).subscribe(
            (authResult) => {
                this.authService.setSession(authResult);
                location.reload();
            }
        );
    }
}
