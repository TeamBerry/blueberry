import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Message, FeedbackMessage, SystemMessage } from '@teamberry/muscadine';

@Component({
    selector: 'app-chat-item',
    templateUrl: './chat-item.component.html',
    styleUrls: ['./chat-item.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ChatItemComponent implements OnInit {
    @Input() message: FeedbackMessage | Message | SystemMessage;
    @Input() username: string;

    typeStyle: string = null;
    author: string;

    constructor() {
    }

    ngOnInit() {
        if ('context' in this.message) {
            this.typeStyle = `context-${this.message.context}`;
        }

        this.author = this.message.author
            ? (typeof this.message.author === 'object' ? this.message.author.name : this.message.author)
            : null;

        this.message.contents = this.parseString(this.message.contents)
    }

    parseString(contents: string): string {
        return contents.replace(
            new RegExp(this.username, 'i'), '<span class="highlight">$&</span>'
        )
    }

}
