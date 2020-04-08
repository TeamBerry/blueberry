import { Component, OnInit, Output, Input, EventEmitter, ViewChild, ElementRef } from '@angular/core';

import { User } from 'app/shared/models/user.model';
import { JukeboxService } from '../../jukebox.service';
import { filter } from 'rxjs/operators';
import { Message, FeedbackMessage } from '@teamberry/muscadine';

@Component({
    selector: 'app-chat-tab',
    templateUrl: './chat-tab.component.html',
    styleUrls: ['./chat-tab.component.scss'],
})
export class ChatTabComponent implements OnInit {
    @Input() boxToken: string;
    @Input() user: User = new User;
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

    /**
     * Connects to jukebox service chat stream to get messages to display
     *
     * @memberof ChatComponent
     */
    connectToStream() {
        console.log('connecting chat to socket...');
        this.jukeboxService.getBoxStream()
            .pipe( // Filtering to only act on Message instances
                filter(message =>
                    (message instanceof Message || message instanceof FeedbackMessage)
                    && message.scope === this.boxToken
                )
            )
            .subscribe(
                (message) => {
                    console.log(message);
                    this.messages.push(message);
                    setTimeout(() => {
                        this.scrollToBottom();
                    }, 200);
                },
                error => {
                    this.socketStatus.emit('offline');
                },
                () => {
                    console.log('CONNECTED');
                    this.socketStatus.emit('online');
                }
            );
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
