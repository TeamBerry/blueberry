import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login-form',
    templateUrl: './login-form.component.html',
    styleUrls: ['./login-form.component.scss'],
    providers: [AuthService]
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
     * Sends the form data tot hte server to attempt connection
     *
     * @memberof LoginFormComponent
     */
    login() {
        console.log('attempting to log in...');
        this.authService.login(this.mail, this.password).subscribe(
            (authResult) => {
                console.log(authResult);
                this.authService.setSession(authResult);
                location.reload();
                // TODO: Dismiss modal and reload page
            }
        );
    }

}
