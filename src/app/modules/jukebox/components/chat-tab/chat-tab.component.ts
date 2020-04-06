import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

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
}
