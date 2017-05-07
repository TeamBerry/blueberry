import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { ChatService } from 'app/services/chat.service';
import { BoxService } from 'app/services/box.service';
import { PlayerService } from 'app/services/player.service';

@Component({
    selector: 'app-chat-widget',
    templateUrl: './chat-widget.component.html',
    styleUrls: ['./chat-widget.component.scss'],
    providers: [ChatService, BoxService, PlayerService]
})
export class ChatWidgetComponent implements OnInit {
    @Input() token: string;
    @Output() skipEvent = new EventEmitter();
    contents: string = "";
    hasLink = false;
    hasCommand = false;
    messages = [];
    playlist;

    constructor(
        private chatService: ChatService,
        private playerService: PlayerService
    ) { }

    ngOnInit() {
        if(this.token !== undefined){
            this.fetchMessages();
            this.fetchPlaylist();
        }
    }

    watchContents(){}

    post(){}

    handleLinks(){}

    handleCommands(){}

    fetchMessages(){
        this.chatService.list(this.token).subscribe(
            data => {
                this.messages = data;
            }
        )
    }

    fetchPlaylist(){
        this.playerService.playlist(this.token).subscribe(
            data => {
                this.playlist = data;
            }
        )

    }

}
