import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { ChatService } from './../../../../shared/services/chat.service';

@Component({
    selector: 'app-chat-widget',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss'],
    providers: [ChatService]
})
export class ChatComponent implements OnInit {
    @Input() token: string;
    @Output() skipEvent = new EventEmitter();
    contents = '';
    hasLink = false;
    hasCommand = false;
    messages = [];

    constructor(
        private chatService: ChatService
    ) { }

    ngOnInit() {
        if (this.token !== undefined) {
            this.fetchMessages();
        }
    }

    fetchMessages() {
        this.chatService.list(this.token).subscribe(
            data => {
                this.messages = data;
            }
        );
    }

    requestSkip() { }
}
