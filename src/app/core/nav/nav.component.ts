import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// Components
import { BoxFormComponent } from '../../shared/components/box-form/box-form.component';
import { LoginFormComponent } from '../../shared/components/login-form/login-form.component';
import { SignupFormComponent } from '../../shared/components/signup-form/signup-form.component';

import { AuthService } from '../../core/auth/auth.service';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {

    constructor(
        private modalService: NgbModal,
        private authService: AuthService
    ) { }

    ngOnInit() {
    }

    openCreateModal() {
        const modalRef = this.modalService.open(BoxFormComponent);
        modalRef.componentInstance.title = 'Create a box';
    }

    login() {
        const modalRef = this.modalService.open(LoginFormComponent);
    }

    signup() {
        const modalRef = this.modalService.open(SignupFormComponent);
    }

    logout(){
        this.authService.logout();
    }

}
