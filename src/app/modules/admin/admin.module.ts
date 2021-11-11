import { NgModule } from '@angular/core';

import { SharedModule } from './../../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { JukeboxModule } from '../jukebox/jukebox.module';

import { BoxesManagerComponent } from './pages/boxes-manager/boxes-manager.component';
import { AclManagerComponent } from './pages/acl-manager/acl-manager.component';

@NgModule({
    declarations: [
        BoxesManagerComponent,
        AclManagerComponent,
    ],
    imports: [
        AdminRoutingModule,
        SharedModule,
        JukeboxModule
    ]
})
export class AdminModule { }
