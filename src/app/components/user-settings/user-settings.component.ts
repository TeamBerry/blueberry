import { Component, OnInit, EventEmitter } from '@angular/core';

import { ThemeService } from 'app/shared/services/theme.service';
import { AuthSubject } from 'app/shared/models/session.model';
import { AuthService } from 'app/core/auth/auth.service';
import { environment } from 'environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PictureUploaderComponent } from 'app/shared/components/picture-uploader/picture-uploader.component';

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

    public color: '#EF4034'

    constructor(
        private modalService: NgbModal,
        private themeService: ThemeService,
    ) { }

    ngOnInit() {
        if (this.session.settings.theme === 'light') {
            this.isDarkThemeEnabled = false;
        }
        this.pictureLocation = `${environment.amazonBuckets}/${environment.profilePictureBuckets}/${this.session.settings.picture}`
    }

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

    openPictureUploader() {
        const modalRef = this.modalService.open(PictureUploaderComponent)
    }
}
