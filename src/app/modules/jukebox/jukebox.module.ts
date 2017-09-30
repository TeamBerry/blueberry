import { NgModule } from '@angular/core';
import { YoutubePlayerModule } from 'ng2-youtube-player';

import { SharedModule } from './../../shared/shared.module';

import { JukeboxRoutingModule } from './jukebox-routing.module';
import { BoxComponent } from './pages/box/box.component';
import { ChatComponent } from './components/chat/chat.component';
import { PlayerComponent } from './components/player/player.component';
import { MoodWidgetComponent } from './components/mood-widget/mood-widget.component';

@NgModule({
    declarations: [
        BoxComponent,
        ChatComponent,
        PlayerComponent,
        MoodWidgetComponent
    ],
    imports: [
        JukeboxRoutingModule,
        SharedModule,
        YoutubePlayerModule
    ],
    exports: [],
    providers: [],
})
export class JukeboxModule { }