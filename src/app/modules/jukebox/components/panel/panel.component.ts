import { Component, OnInit, Output, Input, EventEmitter, AfterViewChecked } from '@angular/core';

import { JukeboxService } from './../../jukebox.service';
import { Message } from 'app/shared/models/message.model';
import { User } from 'app/shared/models/user.model';

@Component({
    selector: 'app-panel',
    templateUrl: './panel.component.html',
    styleUrls: ['./panel.component.scss'],
})
export class PanelComponent implements OnInit, AfterViewChecked {
    @Input() boxToken: string;
    @Input() user: User;

    @Output() skipEvent = new EventEmitter();
    contents = '';
    hasLink = false;
    hasCommand = false;
    activePanel = '';

    constructor(
        private jukeboxService: JukeboxService
    ) { }

    ngOnInit() {
        this.activePanel = 'chat';
    }

    ngAfterViewChecked() {
        if (this.activePanel === 'chat') {
            this.adjustView();
        }
    }

    adjustView() {
        const panelSpace = document.getElementById('chat-space');
        panelSpace.scrollTop = panelSpace.scrollHeight;
    }

    showPanel(panelToken: string) {
        this.activePanel = panelToken;
    }

    watchContents() {
        this.hasCommand = false;
        if (this.contents.indexOf('!') === 0) {
            this.hasCommand = true;
        }
    }

    post(event) {
        event.preventDefault();
        const contents = this.contents;
        this.contents = '';
        if (this.hasCommand && !event.ctrlKey) {
            this.handleCommands(contents);
        } else {
            this.handleMessage(contents);
        }
    }

    handleMessage(contents) {
        const message = new Message({
            author: this.user._id,
            contents: contents,
            scope: this.boxToken,
            source: 'user',
        });
        this.jukeboxService.post(message);
    }

    handleCommands(contents) {
        const command = contents.substr(1).split(' ');
        const keyword = command[0];
        switch (keyword) {
            case 'add':
            case 'queue':
            case 'play':
                this.submitVideo(command[1]);
                break;

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

    refreshChatStatus(event) {
        console.log(event);
    }

    submitVideo(url) {
        const reg = new RegExp(/(\?v=([a-z0-9\-\_]+)\&?)|(\.be\/([a-z0-9\-\_]+)\&?)/i);
        const res = reg.exec(url);

        const video = {
            link: (res[2]) ? res[2] : res[4],
            userToken: this.user._id,
            boxToken: this.boxToken,
        };

        console.log('submitting video...');

        this.jukeboxService.submitVideo(video);
    }
}
