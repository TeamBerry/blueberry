import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';

import { PlaylistsManagerComponent } from './pages/playlists-manager/playlists-manager.component';
import { BadgeCollectionComponent } from './pages/badge-collection/badge-collection.component';
import { CollectionRoutingModule } from './collection-routing.module';

@NgModule({
    imports: [
        CollectionRoutingModule,
        SharedModule,
  ],
    declarations: [
        PlaylistsManagerComponent,
        BadgeCollectionComponent
    ]
})
export class CollectionModule { }
