import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { ChatService } from 'app/services/chat.service';
import { BoxService } from 'app/services/box.service';
import { PlayerService } from 'app/services/player.service';
import { UserService } from 'app/services/user.service';

@Component({
    selector: 'app-chat-widget',
    templateUrl: './chat-widget.component.html',
    styleUrls: ['./chat-widget.component.scss'],
    providers: [ChatService, BoxService, PlayerService, UserService]
})
export class ChatWidgetComponent implements OnInit {
    @Input() token: string;
    @Output() skipEvent = new EventEmitter();
    contents = '';
    hasLink = false;
    hasCommand = false;
    messages = [];
    playlist;
    likes;
    activePanel = 'chat';

    constructor(
        private chatService: ChatService,
        private playerService: PlayerService,
        private userService: UserService
    ) { }

    ngOnInit() {
        if (this.token !== undefined) {
            this.fetchMessages();
            this.fetchPlaylist();
            this.fetchLikes();
        }
    }

    showPanel(panelToken: string) {
        this.activePanel = panelToken;
    }

    watchContents() {
        const reg = new RegExp(/(\?v=([a-z0-9\-\_]+)\&?)|(\.be\/([a-z0-9\-\_]+)\&?)/i);
        let res;
        this.hasCommand = false;
        this.hasLink = false;
        if (this.contents.indexOf('!') === 0){
            this.hasCommand = true;
        } else if (res = reg.exec(this.contents) != null){
            this.hasLink = true;
            // console.log(res);
        }
    }

    post(event) {
        event.preventDefault();
        const contents = this.contents;
        this.contents = '';
        if (this.hasLink) {
            this.handleLinks(contents);
        } else if (this.hasCommand) {
            this.handleCommands(contents);
        } else {
            const message = {
                type: 1,
                scope: 1,
                contents: contents,
                author: 'D1JU70',
                destination: null,
            };
            this.chatService.post(this.token, message).subscribe(
                data => {
                    console.log(data);
                    this.fetchMessages();
                }
            )
        }
    }

    handleLinks(contents) {}

    handleCommands(contents) {}

    fetchMessages() {
        this.chatService.list(this.token).subscribe(
            data => {
                this.messages = data;
            }
        );
    }

    fetchPlaylist() {
        this.playerService.playlist(this.token).subscribe(
            data => {
                this.playlist = data;
            }
        );
    }

    fetchLikes() {
        this.userService.likes('D1JU70').subscribe(
            data => {
                this.likes = data;
            }
        );
    }

}
