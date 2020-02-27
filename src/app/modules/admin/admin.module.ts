import { NgModule } from '@angular/core';

import { SharedModule } from './../../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';

import { AdminPanelComponent } from './pages/admin-panel/admin-panel.component';
import { BoxesTabComponent } from './components/boxes-tab/boxes-tab.component';
import { PlaylistsTabComponent } from './components/playlists-tab/playlists-tab.component';
import { BoxAdminWidgetComponent } from './components/box-admin-widget/box-admin-widget.component';
import { FavoritesTabComponent } from './components/favorites-tab/favorites-tab.component';
import { FavoritesAdminWidgetComponent } from './components/favorites-admin-widget/favorites-admin-widget.component';

@NgModule({
    declarations: [
        AdminPanelComponent,
        BoxesTabComponent,
        PlaylistsTabComponent,
        BoxAdminWidgetComponent,
        FavoritesTabComponent,
        FavoritesAdminWidgetComponent
    ],
    imports: [
        AdminRoutingModule,
        SharedModule
    ]
})
export class AdminModule { }
