import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Command } from 'app/shared/models/command.model';

/**
 * List of commands usable in a box.
 *
 * @export
 * @class CommandListComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'app-command-list',
    templateUrl: './command-list.component.html',
    styleUrls: ['./command-list.component.scss']
})
export class CommandListComponent implements OnInit {
    /**
     * When the user clicks on a command, it is emitted to the panel component that can
     * then inject it in the chat
     *
     * @type {EventEmitter<string>}
     * @memberof CommandListComponent
     */
    @Output() clickedCommand: EventEmitter<string> = new EventEmitter<string>();

    /**
     * List of commands to be displayed
     *
     * @type {Array<Command>}
     * @memberof CommandListComponent
     */
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

    /**
     * Triggered when the user clicks on a command. Will emit the key to the parent component
     *
     * @param {string} key
     * @memberof CommandListComponent
     */
    useCommand(key: string) {
        this.clickedCommand.emit(key);
    }

}
