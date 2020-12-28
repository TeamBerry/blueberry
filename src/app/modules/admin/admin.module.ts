import { NgModule } from '@angular/core';

import { SharedModule } from './../../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { JukeboxModule } from '../jukebox/jukebox.module';

import { AdminPanelComponent } from './pages/admin-panel/admin-panel.component';
import { BoxesManagerComponent } from './components/boxes-manager/boxes-manager.component';
import { PlaylistsManagerComponent } from './components/playlists-manager/playlists-manager.component';
import { AclManagerComponent } from './components/acl-manager/acl-manager.component';
import { BadgeCollectionComponent } from './components/badge-collection/badge-collection.component';

@NgModule({
    declarations: [
        AdminPanelComponent,
        BoxesManagerComponent,
        PlaylistsManagerComponent,
        AclManagerComponent,
        BadgeCollectionComponent
    ],
    imports: [
        AdminRoutingModule,
        SharedModule,
        JukeboxModule
    ]
})
export class AdminModule { }
