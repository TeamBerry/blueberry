import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { UserPlaylistsRoutingModule } from './user-playlists-routing.module';

import { PlaylistsComponent } from './pages/playlists/playlists.component';

@NgModule({
    declarations: [PlaylistsComponent],
    imports: [
        UserPlaylistsRoutingModule,
        SharedModule
    ]
})
export class UserPlaylistsModule { }
