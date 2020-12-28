import { Component, OnInit, EventEmitter } from '@angular/core';
import colorContrast from 'color-contrast'

import { ThemeService } from 'app/shared/services/theme.service';
import { AuthSubject } from 'app/shared/models/session.model';
import { AuthService } from 'app/core/auth/auth.service';
import { environment } from 'environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PictureUploaderComponent } from 'app/shared/components/picture-uploader/picture-uploader.component';
import { UserService } from 'app/shared/services/user.service';
import { FormGroup, FormControl, Validators, ValidationErrors } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PictureDeleterComponent } from 'app/shared/components/picture-deleter/picture-deleter.component';

@Component({
    selector: 'app-user-settings',
    templateUrl: './user-settings.component.html',
    styleUrls: ['./user-settings.component.scss'],
    providers: []
})
export class UserSettingsComponent implements OnInit {
    public currentTab = 'account';

    public close: EventEmitter<any> = new EventEmitter();

    public isDarkThemeEnabled = true;

    public session: AuthSubject = AuthService.getAuthSubject();
    public pictureLocation: string

    public color: string
    public colorWarning: boolean
    public colorError: boolean
    public colorSuccess: boolean

    deactivationForm: FormGroup;
    passwordResetForm: FormGroup;

    errorMessage: string = null;

    constructor(
        private authService: AuthService,
        private modalService: NgbModal,
        private themeService: ThemeService,
        private userService: UserService,
        private toastr: ToastrService
    ) { }

    ngOnInit(): void {
        if (this.session.settings.theme === 'light') {
            this.isDarkThemeEnabled = false;
        }
        this.pictureLocation = `${environment.userContentBucket}/${environment.profilePictureBuckets}/${this.session.settings.picture}`
        this.color = this.session.settings.color ?? '#DF62A9';

        this.deactivationForm = new FormGroup({
            deactivationName: new FormControl('', [Validators.required, this.deactivationValidator.bind(this)])
        })

        this.passwordResetForm = new FormGroup({
            currentPassword: new FormControl('', [
                Validators.required,
                Validators.minLength(8)
            ]),
            newPassword: new FormControl('', [
                Validators.required,
                Validators.minLength(8)
            ]),
            newPasswordVerify: new FormControl('', [
                Validators.required,
                Validators.minLength(8)
            ])
        })
    }

    // Deactivation form
    get deactivationName() { return this.deactivationForm.get('deactivationName'); }

    // Reset password form
    get currentPassword() { return this.passwordResetForm.get('currentPassword'); }
    get newPassword() { return this.passwordResetForm.get('newPassword'); }
    get newPasswordVerify() { return this.passwordResetForm.get('newPasswordVerify'); }

    closeSettings() {
        this.close.emit();
    }

    toggleDarkTheme() {
        if (this.isDarkThemeEnabled === true) {
            this.themeService.toggleLight()
            this.isDarkThemeEnabled = false
        } else {
            this.themeService.toggleDark()
            this.isDarkThemeEnabled = true
        }
    }

    onColorChange(color: string) {
        this.colorSuccess = false;
        this.colorWarning = (colorContrast(color, '#efefef') < 2.5 || colorContrast(color, '#404040') < 1.5);
        this.colorError = (colorContrast(color, '#efefef') < 1.5 || colorContrast(color, '#404040') < 1.2);
    }

    saveChatColor() {
        this.userService.updateSettings({ color: this.color }).subscribe(
            () => {
                this.session.settings.color = this.color;
                localStorage.setItem('BBOX-user', JSON.stringify(this.session));
                this.colorWarning = false;
                this.colorSuccess = true;
            }
        );
    }

    toggleColorBlindMode() {
        this.session.settings.color = '#DF62A9';
        this.userService.updateSettings({ isColorblind: this.session.settings.isColorblind, color: this.session.settings.color }).subscribe(
            () => {
                localStorage.setItem('BBOX-user', JSON.stringify(this.session));
                console.log('Saved.');
            }
        )
    }

    openPictureUploader() {
        const modalRef = this.modalService.open(PictureUploaderComponent)
    }

    openPictureDeleter() {
        const modalRef = this.modalService.open(PictureDeleterComponent)
        modalRef.componentInstance.userPictureName = this.session.settings.picture
    }

    // Deactivation
    public deactivationValidator(control: FormControl): ValidationErrors {
        return control.value !== this.session.name ? { 'mismatch': true } : null;
    }

    deactivateAccount() {
        this.authService.deactivateAccount().subscribe(
            () => {
                this.authService.logout();
            },
            (error) => {
                this.toastr.error(`You still have boxes. Please delete all of them and try again.`, 'Error')
            }
        )
    }

    // Password reset

    /**
     * Checks if the password verification input has the same value as the password input
     *
     * @returns {boolean} Result of the check
     * @memberof SignupFormComponent
     */
    passwordMatchVerify(): boolean {
        return (this.passwordResetForm.value.newPassword === this.passwordResetForm.value.newPasswordVerify);
    };


    resetPassword(): void {
        this.errorMessage = null;
        if (!this.passwordMatchVerify()) {
            this.errorMessage = 'Your password verification is invalid.';
            return;
        }

        this.authService.login(this.session.mail, this.passwordResetForm.value.currentPassword).subscribe(
            () => {
                this.authService.updatePassword(this.passwordResetForm.value.newPassword).subscribe(
                    () => {
                        this.authService.logout();
                    },
                    error => {
                        this.errorMessage = "Your request could not be processed. Please try again."
                    }
                )
            },
            error => {
                this.errorMessage = "Your current password is incorrect."
            }
        )
    }
}
