import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollectionComponent } from './collection.component';

import { PlaylistsManagerComponent } from '../collection/playlists-manager/playlists-manager.component';
import { BadgeCollectionComponent } from '../collection/badge-collection/badge-collection.component';
import { SharedModule } from 'app/shared/shared.module';
import { CollectionRoutingModule } from './collection-routing.module';

@NgModule({
    imports: [
        CollectionRoutingModule,
        SharedModule,
  ],
    declarations: [
        CollectionComponent,
        PlaylistsManagerComponent,
        BadgeCollectionComponent
    ]
})
export class CollectionModule { }
