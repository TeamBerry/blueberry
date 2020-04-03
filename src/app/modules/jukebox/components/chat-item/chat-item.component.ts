import { Component, OnInit, Input } from '@angular/core';
import { Message, FeedbackMessage } from '@teamberry/muscadine';

@Component({
    selector: 'app-chat-item',
    templateUrl: './chat-item.component.html',
    styleUrls: ['./chat-item.component.scss']
})
export class ChatItemComponent implements OnInit {
    @Input() message: Message | FeedbackMessage;

    typeStyle: string;
    author: string;

    constructor() { }

    ngOnInit() {
        this.author = this.message.author
            ? (typeof this.message.author === 'object' ? this.message.author.name : this.message.author)
            : null;
        this.typeStyle = 'feedbackType' in this.message ? `system-message-${this.message.feedbackType}` : null;
    }

}