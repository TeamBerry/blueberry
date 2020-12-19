import { Component, OnInit, Output, Input, EventEmitter, ViewChild, ElementRef, OnChanges } from '@angular/core';

import { JukeboxService } from '../../jukebox.service';
import { filter } from 'rxjs/operators';
import { Message, FeedbackMessage, SystemMessage } from '@teamberry/muscadine';
import { AuthSubject } from 'app/shared/models/session.model';
import { LoginFormComponent } from 'app/shared/components/login-form/login-form.component';
import { SignupFormComponent } from 'app/shared/components/signup-form/signup-form.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChatInputComponent } from '../chat-input/chat-input.component';

@Component({
    selector: 'app-chat-tab',
    templateUrl: './chat-tab.component.html',
    styleUrls: ['./chat-tab.component.scss'],
})
export class ChatTabComponent implements OnInit, OnChanges {
    @Input() boxToken: string;
    @Input() user: AuthSubject;
    @Output() socketStatus = new EventEmitter();
    @ViewChild('chat') chat: ElementRef;
    @ViewChild('chatInput') chatInput: ChatInputComponent;
    contents = '';
    hasLink = false;
    hasCommand = false;
    messages = [];
    filter: 'system' | 'human' = null;
    tabsetOptions = [
        { title: 'All Messages', value: null },
        { title: 'Activity', value: 'system' },
        { title: 'User Chat', value: 'human' }
    ]

    hasAutoScrollEnabled = true;
    hasNewMessages = false;

    constructor(
        private modalService: NgbModal,
        private jukeboxService: JukeboxService
    ) { }

    ngOnInit() {
        if (this.boxToken !== undefined) {
            this.connectToStream();
        }
    }

    ngOnChanges() {
        this.messages = [];
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
                    (message instanceof Message || message instanceof FeedbackMessage || message instanceof SystemMessage)
                    && message.scope === this.boxToken
                )
            )
            .subscribe(
                (message) => {
                    this.messages.push(message);
                    setTimeout(() => {
                        this.scrollToBottom();
                    }, 200);
                },
                error => {
                    this.socketStatus.emit('offline');
                },
                () => {
                    this.socketStatus.emit('online');
                }
            );
    }

    setTab(tab: 'system' | 'human') {
        this.filter = tab;
        this.hasAutoScrollEnabled = true;
        this.scrollToBottom();
    }

    scrollToBottom() {
        if (this.hasAutoScrollEnabled) {
            this.chat.nativeElement.scrollTop = this.chat.nativeElement.scrollHeight;
            this.hasNewMessages = false;
        } else {
            this.hasNewMessages = true;
        }
    }

    resumeAutoScroll() {
        this.chat.nativeElement.scrollTop = this.chat.nativeElement.scrollHeight;
        this.hasNewMessages = false;
        this.hasAutoScrollEnabled = true;
    }

    onScroll() {
        const scrollPosition = this.chat.nativeElement.scrollTop + this.chat.nativeElement.clientHeight
        const autoScrollThreshold = this.chat.nativeElement.scrollHeight - 30;
        this.hasAutoScrollEnabled = (scrollPosition >= autoScrollThreshold);
        if (this.hasAutoScrollEnabled) {
            this.hasNewMessages = false;
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
