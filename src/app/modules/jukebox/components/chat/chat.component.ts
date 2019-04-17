import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

import { User } from 'app/shared/models/user.model';
import { JukeboxService } from '../../jukebox.service';

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
            this.connect();
        }
    }

    connect() {
        console.log('connecting chat to socket...');
        this.jukeboxService.connectToChat(this.boxToken, this.user._id).subscribe(
            message => {
                this.messages.push(message);
            },
            error => {
                this.socketStatus.emit('offline');
            },
            () => {
                this.socketStatus.emit('online');
            }
        );
    }
}
