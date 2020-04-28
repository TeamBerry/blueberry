import { Component, OnInit, Output, Input, EventEmitter, AfterViewChecked, ElementRef, ViewChild, Renderer2, AfterViewInit } from '@angular/core';
import * as _ from 'lodash'
import { ToastrService } from 'ngx-toastr';
import { filter, debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { NgbModal, NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { EmojiSearch } from '@ctrl/ngx-emoji-mart';
import { EmojiData } from '@ctrl/ngx-emoji-mart/ngx-emoji/public_api';

import { JukeboxService } from './../../jukebox.service';
import { Message, FeedbackMessage, BerryCount } from '@teamberry/muscadine';
import { SubmissionPayload } from 'app/shared/models/playlist-payload.model';
import { AuthSubject } from 'app/shared/models/session.model';
import { AuthService } from 'app/core/auth/auth.service';
import { BoxFormComponent } from 'app/shared/components/box-form/box-form.component';
import { Box } from 'app/shared/models/box.model';
import { LoginFormComponent } from 'app/shared/components/login-form/login-form.component';
import { SignupFormComponent } from 'app/shared/components/signup-form/signup-form.component';
import { Observable, fromEvent } from 'rxjs';

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

    berryCount: number = null;

    constructor(
        private modalService: NgbModal,
        private jukeboxService: JukeboxService,
        private toastr: ToastrService,
        private renderer: Renderer2,
        private emojiSearch: EmojiSearch
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
}
