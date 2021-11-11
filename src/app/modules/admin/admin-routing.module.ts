import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AclManagerComponent } from './pages/acl-manager/acl-manager.component';
import { BoxesManagerComponent } from './pages/boxes-manager/boxes-manager.component';

const adminRoutes: Routes = [
    { path: 'boxes', component: BoxesManagerComponent },
    { path: 'moderation', component: AclManagerComponent }
]

@NgModule({
    imports: [
        RouterModule.forChild(adminRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class AdminRoutingModule { }
