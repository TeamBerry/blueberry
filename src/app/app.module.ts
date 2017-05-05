import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { BerryboxNavComponent } from './components/berrybox-nav/berrybox-nav.component';
import { BoxWidgetComponent } from './components/box-widget/box-widget.component';
import { BoxComponent } from './components/box/box.component';
import { ChatComponent } from './components/chat/chat.component';
import { HomeComponent } from './components/home/home.component';
import { MoodWidgetComponent } from './components/mood-widget/mood-widget.component';
import { PlayerComponent } from './components/player/player.component';
import { UserComponent } from './components/user/user.component';

@NgModule({
  declarations: [
    AppComponent,
    BerryboxNavComponent,
    BoxWidgetComponent,
    BoxComponent,
    ChatComponent,
    HomeComponent,
    MoodWidgetComponent,
    PlayerComponent,
    UserComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
