import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { BoxWidgetComponent } from './shared/components/box-widget/box-widget.component';
import { HomeComponent } from './shared/components/home/home.component';
import { UserComponent } from './shared/components/user/user.component';
import { BoxFormComponent } from './shared/components/box-form/box-form.component';
import { LikesComponent } from './shared/components/likes/likes.component';

/* Feature Modules */
import { JukeboxModule } from './modules/jukebox/jukebox.module';

@NgModule({
    declarations: [
        AppComponent,
        BoxWidgetComponent,
        HomeComponent,
        UserComponent,
        BoxFormComponent,
        LikesComponent
    ],
    imports: [
        AppRoutingModule,
        BrowserModule,
        CoreModule,
        JukeboxModule,
        NgbModule.forRoot(),
        SharedModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
