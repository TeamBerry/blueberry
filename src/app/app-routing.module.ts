import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './shared/components/home/home.component';
import { LikesComponent } from './shared/components/likes/likes.component';
import { UserSettingsComponent } from './components/user-settings/user-settings.component';

const appRoutes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'home', component: HomeComponent },
    { path: 'settings', component: UserSettingsComponent}
    /* { path: 'likes', component: LikesComponent } */
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule { }
