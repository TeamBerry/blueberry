import { Component, OnInit, Output, Input, EventEmitter, AfterViewChecked, ViewChild, AfterViewInit } from '@angular/core';
import * as _ from 'lodash'
import { ToastrService } from 'ngx-toastr';
import { filter } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { JukeboxService } from './../../jukebox.service';
import { Message } from '@teamberry/muscadine';
import { AuthSubject } from 'app/shared/models/session.model';
import { AuthService } from 'app/core/auth/auth.service';
import { BoxFormComponent } from 'app/shared/components/box-form/box-form.component';
import { Box } from 'app/shared/models/box.model';
import { LoginFormComponent } from 'app/shared/components/login-form/login-form.component';
import { SignupFormComponent } from 'app/shared/components/signup-form/signup-form.component';
import { ChatInputComponent } from '../chat-input/chat-input.component';

export type Panel = 'chat' | 'queue' | 'users' | 'commands' | 'help' | 'favorites' | 'search'

@Component({
    selector: 'app-panel',
    templateUrl: './panel.component.html',
    styleUrls: ['./panel.component.scss'],
})
export class PanelComponent implements OnInit, AfterViewInit, AfterViewChecked {
    @Input() boxToken: string;
    user: AuthSubject = AuthService.getAuthSubject();
    box: Box;

    @Output() skipEvent = new EventEmitter();
    activePanel: Panel = 'chat';

    /**
     * Boolean to determine whether new messages have been received and the chat panel is not active
     *
     * @memberof PanelComponent
     */
    newMessages = false;

    @ViewChild('chatInput') chatInput: ChatInputComponent;

    constructor(
        private modalService: NgbModal,
        private jukeboxService: JukeboxService,
        private toastr: ToastrService,
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

    ngAfterViewInit() {
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

    handleCommands(keyword: string) {
        switch (keyword) {
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
            case 'queue':
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
     * Connects to jukebox service chat stream to get messages to display
     *
     * @memberof ChatComponent
     */
    connectToStream() {
        this.jukeboxService.getBoxStream()
            .pipe( // Filtering to only act on Message instances
                filter(message =>
                    message instanceof Message && message.scope === this.boxToken
                ),
            )
            .subscribe(
                (contents: Message) => {
                    if (this.activePanel !== 'chat') {
                        if (contents.source !== 'system') {
                            this.newMessages = true
                        } else {
                            this.toastr.info(contents.contents, 'System')
                        }
                    }
                },
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

    /**
     * Kickstarts the use of a command in the chat when a command is clicked in the command list component
     *
     * @param {string} commandKey
     * @memberof PanelComponent
     */
    kickstartCommand(commandKey: string) {
        this.chatInput.contents = `!${commandKey}`
    }
}
