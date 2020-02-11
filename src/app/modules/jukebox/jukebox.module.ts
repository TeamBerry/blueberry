import { NgModule } from '@angular/core';
import { NgxYoutubePlayerModule } from 'ngx-youtube-player';

import { SharedModule } from './../../shared/shared.module';
import { JukeboxService } from './jukebox.service';

import { JukeboxRoutingModule } from './jukebox-routing.module';
import { BoxComponent } from './pages/box/box.component';
import { ChatTabComponent } from './components/chat-tab/chat-tab.component';
import { PlayerComponent } from './components/player/player.component';
import { PanelComponent } from './components/panel/panel.component';
import { PlaylistComponent } from './components/playlist/playlist.component';
import { UserlistComponent } from './components/userlist/userlist.component';
import { FavoriteSearchTabComponent } from './components/favorite-search-tab/favorite-search-tab.component';
import { PlaylistVideoComponent } from './components/playlist-video/playlist-video.component';
import { CommandListComponent } from './components/command-list/command-list.component';
import { YoutubeSearchTabComponent } from './components/youtube-search-tab/youtube-search-tab.component';
import { HelpTabComponent } from './components/help-tab/help-tab.component';
import { SearchTabComponent } from './components/search-tab/search-tab.component';

@NgModule({
    declarations: [
        BoxComponent,
        ChatTabComponent,
        PlayerComponent,
        PanelComponent,
        PlaylistComponent,
        UserlistComponent,
        FavoriteSearchTabComponent,
        PlaylistVideoComponent,
        CommandListComponent,
        YoutubeSearchTabComponent,
        HelpTabComponent,
        SearchTabComponent
    ],
    imports: [
        JukeboxRoutingModule,
        SharedModule,
        NgxYoutubePlayerModule
    ],
    exports: [],
    providers: [
        JukeboxService,
    ]
})
export class JukeboxModule { }