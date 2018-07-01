import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

import { ChatService } from './../../../../shared/services/chat.service';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss'],
    providers: [ChatService]
})
export class ChatComponent implements OnInit {
    @Input() boxToken: string;
    @Output() socketStatus = new EventEmitter();
    contents = '';
    hasLink = false;
    hasCommand = false;
    messages = [];

    constructor(
        private chatService: ChatService
    ) { }

    ngOnInit() {
        console.log(this.boxToken);
        if (this.boxToken !== undefined) {
            this.chatService.connect(this.boxToken, 'D1JU70').subscribe(
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
}
