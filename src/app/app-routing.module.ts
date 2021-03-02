import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './shared/components/home/home.component';
import { PasswordResetComponent } from './pages/password-reset/password-reset.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
import { InviteComponent } from './pages/invite/invite.component';

const appRoutes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'home', component: HomeComponent },
    { path: 'invite/:link', component: InviteComponent },
    { path: 'i/:link', component: InviteComponent },
    { path: 'admin', loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule) },
    { path: 'collection', loadChildren: () => import('./modules/collection/collection.module').then(m => m.CollectionModule) },
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
