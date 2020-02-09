import { Component, OnInit, Output, Input, EventEmitter, AfterViewChecked } from '@angular/core';
import * as _ from 'lodash'

import { JukeboxService } from './../../jukebox.service';
import { Message } from 'app/shared/models/message.model';
import { User } from 'app/shared/models/user.model';
import { SubmissionPayload } from 'app/shared/models/playlist-payload.model';
import { AuthSubject } from 'app/shared/models/session.model';
import { AuthService } from 'app/core/auth/auth.service';
import { filter } from 'rxjs/operators';
import { BoxFormComponent } from 'app/shared/components/box-form/box-form.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Box } from 'app/shared/models/box.model';
import { LoginFormComponent } from 'app/shared/components/login-form/login-form.component';
import { SignupFormComponent } from 'app/shared/components/signup-form/signup-form.component';

export type Panel = 'chat' | 'queue' | 'users' | 'commands' | 'help' | 'favorites' | 'search'

@Component({
    selector: 'app-panel',
    templateUrl: './panel.component.html',
    styleUrls: ['./panel.component.scss'],
})
export class PanelComponent implements OnInit, AfterViewChecked {
    @Input() boxToken: string;
    user: AuthSubject = AuthService.getAuthSubject();
    box: Box;

    @Output() skipEvent = new EventEmitter();
    contents = '';
    hasLink = false;
    hasCommand = false;
    activePanel: Panel = 'chat';

    /**
     * Boolean to determine whether new messages have been received and the chat panel is not active
     *
     * @memberof PanelComponent
     */
    newMessages = false;

    constructor(
        private modalService: NgbModal,
        private jukeboxService: JukeboxService
    ) { }

    ngOnInit() {
        this.activePanel = 'chat';
        this.connectToStream();
        this.jukeboxService.getBox().subscribe(
            (box: Box) => {
                this.box = box;
            }
        )
    }

    ngAfterViewChecked() {
        if (this.activePanel === 'chat') {
            this.adjustView();
        }
    }

    adjustView() {
        const panelSpace = document.getElementById('panel-space');
        panelSpace.scrollTop = panelSpace.scrollHeight;
    }

    showPanel(panelToken: Panel) {
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

            case 'settings':
                this.openBoxSettings();
                break;

            case 'help':
                this.activePanel = 'help';
                break;

            case 'chat':
                this.activePanel = 'chat';
                this.newMessages = false;
                break;

            case 'playlist':
                this.activePanel = 'queue';
                break;

            case 'users':
            case 'userlist':
                this.activePanel = 'users';
                break;

            case 'search':
                this.activePanel = 'search';
                break;

            case 'commands':
            case 'macros':
                this.activePanel = 'commands';
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

    /**
     * Connects to jukebox service chat stream to get messages to display
     *
     * @memberof ChatComponent
     */
    connectToStream() {
        this.jukeboxService.getBoxStream()
            .pipe( // Filtering to only act on Message instances
                filter(message => message instanceof Message && message.scope === this.boxToken)
            )
            .subscribe(
                (message: Message) => {
                    if (this.activePanel !== 'chat') {
                        this.newMessages = true
                    }
                }
            );
    }

    openBoxSettings() {
        if (this.jukeboxService.evaluateCommandPower()) {
            const modalRef = this.modalService.open(BoxFormComponent)
            modalRef.componentInstance.title = `Edit Box Settings`
            modalRef.componentInstance.box = _.cloneDeep(this.box)
        }
    }

    openLoginPrompt() {
        this.modalService.open(LoginFormComponent);
    }

    openSignupPrompt() {
        this.modalService.open(SignupFormComponent);
    }
}
