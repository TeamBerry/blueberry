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
    color: string;

    constructor() {
    }

    ngOnInit() {
        if ('context' in this.message) {
            this.typeStyle = `context-${this.message.context}`;
        }

        if (typeof this.message.author === 'object') {
            this.author = this.message.author.name;
            this.color = this.message.author?.color ?? '#DF62A9';
        } else {
            this.author = this.message.author ?? null;
        }

        this.message.contents = this.parseString(this.message.contents)
    }

    parseString(contents: string): string {
        return contents.replace(
            new RegExp(this.username, 'i'), '<span class="highlight">$&</span>'
        )
    }

}
