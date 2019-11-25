import { Component, OnInit, Output, Input, EventEmitter, AfterViewChecked } from '@angular/core';

import { JukeboxService } from './../../jukebox.service';
import { Message } from 'app/shared/models/message.model';
import { User } from 'app/shared/models/user.model';
import { SubmissionPayload } from 'app/shared/models/playlist-payload.model';
import { AuthSubject } from 'app/shared/models/session.model';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
    selector: 'app-panel',
    templateUrl: './panel.component.html',
    styleUrls: ['./panel.component.scss'],
})
export class PanelComponent implements OnInit, AfterViewChecked {
    @Input() boxToken: string;
    user: AuthSubject = AuthService.getAuthSubject();

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

    handleMessage(contents: string) {
        const message = new Message({
            author: this.user._id,
            contents: contents,
            scope: this.boxToken,
            source: 'user',
        });
        this.jukeboxService.postMessageToSocket(message);
    }

    /**
     * Kickstarts the use of a command in the chat when a command is clicked in the command list component
     *
     * @param {string} commandKey
     * @memberof PanelComponent
     */
    kickstartCommand(commandKey: string) {
        this.contents += `!${commandKey} `;
        this.watchContents();
    }

    handleCommands(contents: string) {
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
                this.jukeboxService.skipVideo();
                break;

            case 'shuffle':
            case 'random':
                /* this.shuffle(); */
                break;

            default:
                break;
        }
    }

    refreshChatStatus(event) {
        console.log(event);
    }

    /**
     * Submits a video by its URL. Will control if the url is valid.
     *
     * @param {string} url The YouTube URL of the video.
     * @memberof PanelComponent
     */
    submitVideo(url: string) {
        const reg = new RegExp(/(\?v=([a-z0-9\-\_]+)\&?)|(\.be\/([a-z0-9\-\_]+)\&?)/i);
        const res = reg.exec(url);

        try {
            const video: SubmissionPayload = {
                link: (res[2]) ? res[2] : res[4],
                userToken: this.user._id,
                boxToken: this.boxToken,
            };

            this.jukeboxService.submitVideo(video);
        } catch (error) {
            const message: Message = new Message({
                contents: 'The video URL you submitted is not a valid YouTube URL.',
                source: 'system',
                scope: this.boxToken,
                time: new Date()
            });
            this.jukeboxService.postMessageToStream(message);
        }
    }
}
