import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { ChatService } from './../../../../shared/services/chat.service';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss'],
    providers: [ChatService]
})
export class ChatComponent implements OnInit {
    @Input() token: string;
    @Output() socketStatus = new EventEmitter();
    contents = '';
    hasLink = false;
    hasCommand = false;
    messages = [];

    constructor(
        private chatService: ChatService
    ) { }

    ngOnInit() {
        if (this.token !== undefined) {
            this.chatService.connect(this.token, 'D1JU70').subscribe(
                message => {
                    // TODO: Push recieved messages in the list of messages
                    console.log("recieved from socket: ", message);
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
