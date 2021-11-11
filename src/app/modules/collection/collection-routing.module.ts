import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BadgeCollectionComponent } from './pages/badge-collection/badge-collection.component';
import { PlaylistsManagerComponent } from './pages/playlists-manager/playlists-manager.component';

const collectionRoutes: Routes = [
    { path: 'playlists', component: PlaylistsManagerComponent },
    { path: 'badges', component: BadgeCollectionComponent },
]

@NgModule({
    imports: [
        RouterModule.forChild(collectionRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class CollectionRoutingModule { }
