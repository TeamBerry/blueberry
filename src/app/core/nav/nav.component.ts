import { Component, OnInit, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// Components
import { BoxFormComponent } from '../../shared/components/box-form/box-form.component';
import { LoginFormComponent } from '../../shared/components/login-form/login-form.component';
import { SignupFormComponent } from '../../shared/components/signup-form/signup-form.component';

import { AuthService } from '../../core/auth/auth.service';

// User settings
import { SettingsDirective } from '../../shared/directive/settings.directive';
import { UserSettingsComponent } from '../../components/user-settings/user-settings.component';
import { User } from 'app/shared/models/user.model';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.scss'],
    entryComponents: [
        UserSettingsComponent
    ]
})
export class NavComponent implements OnInit {
    public user: User;

    /**
     * Directive to dynamically load the settings components without having to leave the box
     *
     * @type {SettingsDirective}
     * @memberof NavComponent
     */
    @ViewChild(SettingsDirective) settingsHost: SettingsDirective;

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private modalService: NgbModal,
        private authService: AuthService
    ) { }

    ngOnInit() {
        if (this.authService.isLoggedIn()) {
            this.authService.getUser().subscribe(
                (user: User) => {
                    this.user = user;
                }
            )
        }
    }

    openCreateModal() {
        const modalRef = this.modalService.open(BoxFormComponent);
        modalRef.componentInstance.title = 'Create a box';
    }

    summonSettings() {
        const viewContainerRef = this.settingsHost.viewContainerRef;
        viewContainerRef.clear();

        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(UserSettingsComponent);
        const componentRef = viewContainerRef.createComponent(componentFactory);

        componentRef.instance.user = this.user;
        componentRef.instance.close.subscribe(
            () => {
                viewContainerRef.clear();
            }
        )
    }

    login() {
        this.modalService.open(LoginFormComponent);
    }

    signup() {
        this.modalService.open(SignupFormComponent);
    }

    logout() {
        this.authService.logout();
    }

}
