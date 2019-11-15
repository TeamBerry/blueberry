import { Injectable } from '@angular/core';
import { AuthSubject } from '../models/session.model';
import { AuthService } from 'app/core/auth/auth.service';

export const darkTheme = {
    'background-main-color': '#0B1A2D',
    'background-main-border-color': '#979797',
    'background-secondary-color': '#0B1A38',
    'input-main-color': '#D0D0D0',
    'text-main-color': 'white',
    'background-focus-color': '#192929',
    'text-system-color': '#BBBBBB',
    'inactive-color': '#CCCCCC'
}

export const lightTheme = {
    'background-main-color': 'white',
    'background-main-border-color': '#979797',
    'background-secondary-color': '#0B1A38',
    'input-main-color': '#D0D0D0',
    'text-main-color': 'black',
    'background-focus-color': '#192929',
    'text-system-color': '#444444',
    'inactive-color': '#8F8F8F'
}

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    user: AuthSubject = AuthService.getAuthSubject();

    constructor() { }

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

    private setTheme(theme: {}) {
        Object.keys(theme).forEach(key =>
            document.documentElement.style.setProperty(`--${key}`, theme[key])
        );
    }
}
