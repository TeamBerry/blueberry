import { Component, OnInit, Output, Input, EventEmitter, AfterViewChecked } from '@angular/core';
import { ChatService } from './../../../../shared/services/chat.service';

@Component({
    selector: 'app-panel',
    templateUrl: './panel.component.html',
    styleUrls: ['./panel.component.scss'],
    providers: [ChatService]
})
export class PanelComponent implements OnInit, AfterViewChecked {
    @Input() token: string;
    @Output() skipEvent = new EventEmitter();
    contents = '';
    hasLink = false;
    hasCommand = false;
    activePanel = '';

    constructor(
        private chatService: ChatService
    ) { }

    ngOnInit() {
        this.activePanel = 'chat';
    }

    ngAfterViewChecked() {
        if (this.activePanel === 'chat') {
            this.adjustChat();
        }
    }

    adjustChat() {
        const chatSpace = document.getElementById('chat-space');
        chatSpace.scrollTop = chatSpace.scrollHeight;
    }

    showPanel(panelToken: string) {
        this.activePanel = panelToken;
    }

    watchContents() {
        const reg = new RegExp(/(\?v=([a-z0-9\-\_]+)\&?)|(\.be\/([a-z0-9\-\_]+)\&?)/i);
        let res;
        this.hasCommand = false;
        this.hasLink = false;
        if (this.contents.indexOf('!') === 0) {
            this.hasCommand = true;
        } else if (res = reg.exec(this.contents) != null) {
            this.hasLink = true;
        }
    }

    post(event) {
        event.preventDefault();
        const contents = this.contents;
        this.contents = '';
        if (this.hasLink && !event.ctrlKey) {
            this.handleLinks(contents);
        } else if (this.hasCommand && !event.ctrlKey) {
            this.handleCommands(contents);
        } else {
            this.handleMessage(contents);
        }
    }

    handleMessage(contents) {
        const message = {
            type: 1,
            scope: 1,
            contents: contents,
            author: 'D1JU70',
            token: this.token,
        };
        this.chatService.post(message);
    }

    handleLinks(contents) {
        const reg = new RegExp(/(\?v=([a-z0-9\-\_]+)\&?)|(\.be\/([a-z0-9\-\_]+)\&?)/i);
        const res = reg.exec(contents);

        const video = {
            link: (res[2]) ? res[2] : res[4],
            author: 'D1JU70'
        };

        /* this.playerService.submit(this.token, video).subscribe(
            data => {
                this.fetchPlaylist();
            }
        ); */
    }

    handleCommands(contents) {
        const command = contents.substr(1).split(' ');
        switch (command[0]) {
            case 'skip':
            case 'next':
                this.emitSkip();
                break;

            case 'shuffle':
            case 'random':
                /* this.shuffle(); */
                break;

            default:
                break;
        }
    }

    emitSkip() {
        this.skipEvent.emit();
    }

    refreshChatStatus(event){
        console.log(event);
    }
}
