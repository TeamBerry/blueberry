import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-command-list',
    templateUrl: './command-list.component.html',
    styleUrls: ['./command-list.component.scss']
})
export class CommandListComponent implements OnInit {
    @Output() clickedCommand: EventEmitter<string> = new EventEmitter<string>();

    constructor() { }

    ngOnInit() {
    }

}
