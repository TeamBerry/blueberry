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
import { CommandListComponent } from './components/command-list/command-list.component';
import { YoutubeSearchTabComponent } from './components/youtube-search-tab/youtube-search-tab.component';
import { HelpTabComponent } from './components/help-tab/help-tab.component';
import { SearchTabComponent } from './components/search-tab/search-tab.component';
import { ChatItemComponent } from './components/chat-item/chat-item.component';
import { ChatInputComponent } from './components/chat-input/chat-input.component';
import { ChatBadgeComponent } from './components/chat-badge/chat-badge.component';

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
        CommandListComponent,
        YoutubeSearchTabComponent,
        HelpTabComponent,
        SearchTabComponent,
        ChatItemComponent,
        ChatInputComponent,
        ChatBadgeComponent
    ],
    imports: [
        JukeboxRoutingModule,
        SharedModule,
    ],
    exports: [
        ChatTabComponent,
        PlayerComponent,
        QueueComponent,
        SearchTabComponent,
        ChatInputComponent
    ],
    providers: [
        JukeboxService,
    ]
})
export class JukeboxModule { }
