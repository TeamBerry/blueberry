import { NgModule } from '@angular/core';
import { YoutubePlayerModule } from 'ng2-youtube-player';

import { SharedModule } from './../../shared/shared.module';
import { JukeboxService } from './jukebox.service';

import { JukeboxRoutingModule } from './jukebox-routing.module';
import { BoxComponent } from './pages/box/box.component';
import { ChatComponent } from './components/chat/chat.component';
import { PlayerComponent } from './components/player/player.component';
import { MoodWidgetComponent } from './components/mood-widget/mood-widget.component';
import { PanelComponent } from './components/panel/panel.component';
import { PlaylistComponent } from './components/playlist/playlist.component';
import { UserlistComponent } from './components/userlist/userlist.component';
import { FavoritelistComponent } from './components/favoritelist/favoritelist.component';

@NgModule({
    declarations: [
        BoxComponent,
        ChatComponent,
        PlayerComponent,
        MoodWidgetComponent,
        PanelComponent,
        PlaylistComponent,
        UserlistComponent,
        FavoritelistComponent
    ],
    imports: [
        JukeboxRoutingModule,
        SharedModule,
        YoutubePlayerModule
    ],
    exports: [],
    providers: [
        JukeboxService
    ],
})
export class JukeboxModule { }