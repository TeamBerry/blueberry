import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { YoutubePlayerModule } from 'ng2-youtube-player';

import { AppComponent } from './app.component';
import { BerryboxNavComponent } from './components/berrybox-nav/berrybox-nav.component';
import { BoxWidgetComponent } from './components/box-widget/box-widget.component';
import { BoxComponent } from './components/box/box.component';
import { HomeComponent } from './components/home/home.component';
import { MoodWidgetComponent } from './components/mood-widget/mood-widget.component';
import { PlayerComponent } from './components/player/player.component';
import { UserComponent } from './components/user/user.component';
import { AppRoutingModule } from 'app/app-routing.module';
import { ChatWidgetComponent } from './components/chat-widget/chat-widget.component';
import { BoxFormComponent } from './components/box-form/box-form.component';
import { LikesComponent } from './components/likes/likes.component';

@NgModule({
  declarations: [
    AppComponent,
    BerryboxNavComponent,
    BoxWidgetComponent,
    BoxComponent,
    HomeComponent,
    MoodWidgetComponent,
    PlayerComponent,
    UserComponent,
    ChatWidgetComponent,
    BoxFormComponent,
    LikesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    YoutubePlayerModule,
    NgbModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
