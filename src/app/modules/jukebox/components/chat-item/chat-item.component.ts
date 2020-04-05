import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Message, FeedbackMessage } from '@teamberry/muscadine';

@Component({
    selector: 'app-chat-item',
    templateUrl: './chat-item.component.html',
    styleUrls: ['./chat-item.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ChatItemComponent implements OnInit {
    @Input() message: Message | FeedbackMessage;
    @Input() username: string;

    typeStyle: string;
    author: string;

    constructor() { }

    ngOnInit() {
        this.author = this.message.author
            ? (typeof this.message.author === 'object' ? this.message.author.name : this.message.author)
            : null;
        this.typeStyle = 'feedbackType' in this.message ? `system-message-${this.message.feedbackType}` : null;

        this.message.contents = this.parseString(this.message.contents)
    }

    parseString(contents: string): string {
        return contents.replace(
            new RegExp(this.username, 'i'), '<span class="highlight">$&</span>'
        )
    }

}
