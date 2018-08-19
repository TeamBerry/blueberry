import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

import { ChatService } from './../../../../shared/services/chat.service';
import { User } from 'app/shared/models/user.model';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss'],
    providers: [ChatService]
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
        private chatService: ChatService
    ) { }

    ngOnInit() {
        if (this.boxToken !== undefined) {
            this.connect();
        }
    }

    connect() {
        this.chatService.connect(this.boxToken, this.user.token).subscribe(
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
