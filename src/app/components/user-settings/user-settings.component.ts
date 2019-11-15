import { Component, OnInit, EventEmitter, Input } from '@angular/core';

import { User } from '../../shared/models/user.model';
import { ThemeService } from 'app/shared/services/theme.service';
import { AuthSubject } from 'app/shared/models/session.model';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
    selector: 'app-user-settings',
    templateUrl: './user-settings.component.html',
    styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent implements OnInit {

    public currentTab = 'account';
    @Input() user: User;

    public close: EventEmitter<any> = new EventEmitter();

    public isDarkThemeEnabled = true;

    public session: AuthSubject = AuthService.getAuthSubject();

    constructor(
        private themeService: ThemeService
    ) { }

    ngOnInit() {
        console.log(this.user);

        if (this.session.settings.theme === 'light') {
            this.isDarkThemeEnabled = false;
        }
    }

    closeSettings() {
        this.close.emit();
    }

    toggleDarkTheme() {
        if (this.isDarkThemeEnabled) {
            this.themeService.toggleLight()
        } else {
            this.themeService.toggleDark()
        }
    }

}
