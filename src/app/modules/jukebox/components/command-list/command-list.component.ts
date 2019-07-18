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
            keys: ['add', 'play', 'queue'],
            arguments: ['URL'],
            description: 'Adds a video to the playlist, by the given YouTube link.',
            staffOnly: false,
        },
        {
            keys: ['skip', 'next'],
            description: 'Skips the currently playing video',
            staffOnly: true
        }
    ];

    constructor() { }

    ngOnInit() {
    }

}
