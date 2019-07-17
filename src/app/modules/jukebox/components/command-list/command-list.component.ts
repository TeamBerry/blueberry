import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Command } from 'app/shared/models/command.model';

@Component({
    selector: 'app-command-list',
    templateUrl: './command-list.component.html',
    styleUrls: ['./command-list.component.scss']
})
export class CommandListComponent implements OnInit {
    @Output() clickedCommand: EventEmitter<string> = new EventEmitter<string>();

    commands: Array<Command> = [
        {
            keys: ['play', 'add'],
            arguments: ['URL'],
            description: 'Add a video to the playlist'
        }
    ];

    constructor() { }

    ngOnInit() {
    }

}
