import { NgModule } from '@angular/core';

import { SharedModule } from './../../shared/shared.module';
import { JukeboxService } from './jukebox.service';

import { JukeboxRoutingModule } from './jukebox-routing.module';
import { BoxComponent } from './pages/box/box.component';
import { ChatTabComponent } from './components/chat-tab/chat-tab.component';
import { PlayerComponent } from './components/player/player.component';
import { PanelComponent } from './components/panel/panel.component';
import { QueueComponent } from './components/queue/queue.component';
import { UserlistComponent } from './components/userlist/userlist.component';
import { PlaylistsSearchTabComponent } from './components/playlists-search-tab/playlists-search-tab.component';
import { QueueVideoComponent } from './components/queue-video/queue-video.component';
import { YoutubeSearchTabComponent } from './components/youtube-search-tab/youtube-search-tab.component';
import { SearchTabComponent } from './components/search-tab/search-tab.component';
import { ChatItemComponent } from './components/chat-item/chat-item.component';
import { ChatInputComponent } from './components/chat-input/chat-input.component';
import { ChatBadgeComponent } from './components/chat-badge/chat-badge.component';
import { BerryCounterComponent } from './components/berry-counter/berry-counter.component';
import { DurationLineComponent } from './components/duration-line/duration-line.component';
import { RoleSelectorComponent } from './components/role-selector/role-selector.component';
import { AngularSvgIconModule } from 'angular-svg-icon';

@NgModule({
    declarations: [
        BoxComponent,
        ChatTabComponent,
        PlayerComponent,
        PanelComponent,
        QueueComponent,
        UserlistComponent,
        PlaylistsSearchTabComponent,
        QueueVideoComponent,
        YoutubeSearchTabComponent,
        SearchTabComponent,
        ChatItemComponent,
        ChatInputComponent,
        ChatBadgeComponent,
        BerryCounterComponent,
        DurationLineComponent,
        RoleSelectorComponent,
    ],
    imports: [
        JukeboxRoutingModule,
        SharedModule,
        AngularSvgIconModule,
    ],
    exports: [
        ChatTabComponent,
        PlayerComponent,
        QueueComponent,
        SearchTabComponent,
        UserlistComponent,
        ChatInputComponent
    ],
    providers: [
        JukeboxService,
    ]
})
export class JukeboxModule { }
