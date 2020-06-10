import { Component, OnInit, Input } from '@angular/core';
import { Message } from '@teamberry/muscadine';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-chat-badge',
  templateUrl: './chat-badge.component.html',
  styleUrls: ['./chat-badge.component.scss']
})
export class ChatBadgeComponent implements OnInit {
    @Input() author: Message['author'];

    isStaff;

    constructor() { }

    ngOnInit() {
        this.isStaff = environment.adminId === this.author._id
    }

}
