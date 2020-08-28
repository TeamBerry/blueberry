import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './shared/components/home/home.component';
import { PasswordResetComponent } from './pages/password-reset/password-reset.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';

const appRoutes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'home', component: HomeComponent },
    { path: 'admin', loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule) },
    // { path: 'playlists', loadChildren: () => import('./modules/user-playlists/user-playlists.module').then(m => m.UserPlaylistsModule) },
    { path: 'password/reset', component: PasswordResetComponent },
    { path: 'privacy', component: PrivacyPolicyComponent }
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
