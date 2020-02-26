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

    constructor() { }

    ngOnInit() {
        this.typeStyle = 'feedbackType' in this.message ? `system-message-${this.message.feedbackType}` : null;
        console.log(this.typeStyle);
    }

}
