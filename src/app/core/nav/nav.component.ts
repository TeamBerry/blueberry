import { Component, OnInit, ViewChild, ComponentFactoryResolver, HostListener } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// Components
import { BoxFormComponent } from '../../shared/components/box-form/box-form.component';
import { LoginFormComponent } from '../../shared/components/login-form/login-form.component';
import { SignupFormComponent } from '../../shared/components/signup-form/signup-form.component';

import { AuthService } from '../../core/auth/auth.service';

// User settings
import { SettingsDirective } from '../../shared/directive/settings.directive';
import { UserSettingsComponent } from '../../components/user-settings/user-settings.component';
import { ThemeService } from 'app/shared/services/theme.service';
import { AuthSubject } from 'app/shared/models/session.model';
import { environment } from 'environments/environment';
import { BoxJoinComponent } from 'app/shared/components/box-join/box-join.component';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.scss'],
    entryComponents: [
        UserSettingsComponent
    ]
})
export class NavComponent implements OnInit {
    public user: AuthSubject;
    public pictureLocation = '../../../assets/images/berrybox-staff-logo.png';
    public isMenuCollapsed = true;

    /**
     * Directive to dynamically load the settings components without having to leave the box
     *
     * @type {SettingsDirective}
     * @memberof NavComponent
     */
    @ViewChild(SettingsDirective, { static: true }) settingsHost: SettingsDirective;

    @HostListener('document:keydown.escape', ['$event']) onEscape(event: KeyboardEvent) {
        this.settingsHost.viewContainerRef.clear();
    }

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private modalService: NgbModal,
        private themeService: ThemeService,
        private authService: AuthService
    ) { }

    ngOnInit() {
        if (this.authService.isLoggedIn()) {
            this.authService.getUser().subscribe(
                (user: AuthSubject) => {
                    this.user = user;
                    this.pictureLocation = `${environment.amazonBuckets}/${environment.profilePictureBuckets}/${user.settings.picture}`
                }
            )
        }

        this.themeService.init()
    }

    openCreateModal() {
        const modalRef = this.modalService.open(BoxFormComponent, { size: 'xl' });
        modalRef.componentInstance.title = 'Create a box';

        this.settingsHost.viewContainerRef.clear();
    }

    openJoinModal() {
        const modalRef = this.modalService.open(BoxJoinComponent);
        this.settingsHost.viewContainerRef.clear();
    }

    summonSettings() {
        const viewContainerRef = this.settingsHost.viewContainerRef;
        viewContainerRef.clear();

        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(UserSettingsComponent);
        const componentRef = viewContainerRef.createComponent(componentFactory);

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
