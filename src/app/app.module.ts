import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { BoxWidgetComponent } from './shared/components/box-widget/box-widget.component';
import { HomeComponent } from './shared/components/home/home.component';
import { UserComponent } from './shared/components/user/user.component';
import { BoxFormComponent } from './shared/components/box-form/box-form.component';

// Auth component
import { NavComponent } from './core/nav/nav.component'; // Exceptional, so it can benefit from the auth directive
import { LoginFormComponent } from './shared/components/login-form/login-form.component';
import { SignupFormComponent } from './shared/components/signup-form/signup-form.component';

// Settings
import { SettingsDirective } from './shared/directive/settings.directive';
import { UserSettingsComponent } from './components/user-settings/user-settings.component';

/* Feature Modules */
import { JukeboxModule } from './modules/jukebox/jukebox.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PlaylistFormComponent } from './shared/components/playlist-form/playlist-form.component';

@NgModule({
    declarations: [
        AppComponent,
        BoxWidgetComponent,
        HomeComponent,
        UserComponent,
        BoxFormComponent,
        LoginFormComponent,
        SignupFormComponent,
        NavComponent,
        SettingsDirective,
        UserSettingsComponent,
        PlaylistFormComponent
    ],
    imports: [
        AppRoutingModule,
        BrowserModule,
        BrowserAnimationsModule,
        SharedModule,
        CoreModule,
        JukeboxModule,
        NgbModule.forRoot()
    ],
    exports: [
        AppComponent
    ],
    bootstrap: [AppComponent],
    entryComponents: [
        BoxFormComponent,
        LoginFormComponent,
        SignupFormComponent,
        UserSettingsComponent,
        PlaylistFormComponent
    ]
})
export class AppModule { }
