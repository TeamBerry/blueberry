import { Injectable } from '@angular/core';
import { AuthSubject } from '../models/session.model';
import { AuthService } from 'app/core/auth/auth.service';
import { UserService } from './user.service';

export const darkTheme = {
    'background-main-color': '#0B1A38',
    'background-main-hover-color': '#102641',
    'background-main-active-color': '#1a3e6a',
    'background-main-border-color': '#979797',
    // Main Color, lighten 15%
    'background-secondary-color': '#1a3e6a',
    // Secondary Color, lighten 5%
    'background-secondary-color-alternate': '#1f4a7e',
    'input-main-color': '#D0D0D0',
    'text-main-color': 'white',
    'text-secondary-color': '#e6e6e6',
    'background-focus-color': '#192929',
    'text-focus-color': '#009AEB',
    'text-system-color': '#BBBBBB',
    'stroke-color': '#BBBBBB',
    'inactive-color': '#CCCCCC'
}

export const lightTheme = {
    'background-main-color': 'white',
    'background-main-hover-color': '#f2f2f2',
    'background-main-active-color': '#d9d9d9',
    'background-main-border-color': '#979797',
    // Main Color, darken 15%
    'background-secondary-color': '#d9d9d9',
    // Secondary Color, darken 5%
    'background-secondary-color-alternate': '#cccccc',
    'input-main-color': '#d0d0d0',
    'text-main-color': 'black',
    'text-secondary-color': '#1a1a1a',
    'background-focus-color': '#e6e6e6',
    'text-focus-color': '#009AEB',
    'text-system-color': '#444444',
    'stroke-color': '#444444',
    'inactive-color': '#8f8f8f',
}

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    user: AuthSubject = AuthService.getAuthSubject();
    updateTimeout;

    constructor(
        private userService: UserService
    ) { }

    /**
     * Sets the proper theme according to the user settings.
     *
     * @memberof ThemeService
     */
    init() {
        if (this.user && this.user.settings.theme === 'light') {
            this.setTheme(lightTheme)
        } else {
            this.setTheme(darkTheme, false)
        }
    }

    toggleDark() {
        this.setTheme(darkTheme)
        this.user.settings.theme = 'dark'
        localStorage.setItem('BBOX-user', JSON.stringify(this.user));
    }

    toggleLight() {
        this.setTheme(lightTheme)
        this.user.settings.theme = 'light'
        localStorage.setItem('BBOX-user', JSON.stringify(this.user));

    }

    /**
     * Sets the theme. If the refresh settings flag is at true, then the API is consumed
     *
     * The flag is present so the default theme can be applied even when no user is connected
     *
     * @private
     * @param {{}} theme
     * @param {boolean} [refreshSettings=true]
     * @memberof ThemeService
     */
    private setTheme(theme: {}, refreshSettings = true) {
        Object.keys(theme).forEach(key =>
            document.documentElement.style.setProperty(`--${key}`, theme[key])
        );

        // Refresh user settings
        clearTimeout(this.updateTimeout)
        if (refreshSettings) {
            this.updateTimeout = setTimeout(() => {
                this.userService.updateSettings({ theme: this.user.settings.theme }).subscribe()
            }, 700)
        }
    }
}
