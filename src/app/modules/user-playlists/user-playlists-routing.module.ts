import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PlaylistsComponent } from './pages/playlists/playlists.component';

const userPlaylistsRoutes: Routes = [
    { path: '', component: PlaylistsComponent }
]

@NgModule({
    imports: [
        RouterModule.forChild(userPlaylistsRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class UserPlaylistsRoutingModule { }
