import { NgModule } from '@angular/core';

import { SharedModule } from './../../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';

import { AdminPanelComponent } from './pages/admin-panel/admin-panel.component';
import { BoxesTabComponent } from './components/boxes-tab/boxes-tab.component';
import { PlaylistsTabComponent } from './components/playlists-tab/playlists-tab.component';

@NgModule({
    declarations: [
        AdminPanelComponent,
        BoxesTabComponent,
        PlaylistsTabComponent
    ],
    imports: [
        AdminRoutingModule,
        SharedModule
    ]
})
export class AdminModule { }
