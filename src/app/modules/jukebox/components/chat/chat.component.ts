import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

import { User } from 'app/shared/models/user.model';
import { JukeboxService } from '../../jukebox.service';
import { Message } from 'app/shared/models/message.model';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
    @Input() boxToken: string;
    @Input() user: User = new User;
    @Output() socketStatus = new EventEmitter();
    contents = '';
    hasLink = false;
    hasCommand = false;
    messages = [];

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
                filter(message => message instanceof Message)
            )
            .subscribe(
                (message: Message) => {
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
