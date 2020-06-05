import { Component, OnInit, Output, Input, EventEmitter, ViewChild, ElementRef, OnChanges } from '@angular/core';

import { JukeboxService } from '../../jukebox.service';
import { filter } from 'rxjs/operators';
import { Message, FeedbackMessage, SystemMessage } from '@teamberry/muscadine';
import { AuthSubject } from 'app/shared/models/session.model';

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
}
