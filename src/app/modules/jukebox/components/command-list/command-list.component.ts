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
            keys: ['chat'],
            description: 'Summons the chat tab',
            staffOnly: false,
        },
        {
            keys: ['playlist'],
            description: 'Summons the playlist tab',
            staffOnly: false
        },
        {
            keys: ['users', 'userlist'],
            description: 'Summons the user list',
            staffOnly: false
        },
        {
            keys: ['search'],
            description: 'Summons the search tab',
            staffOnly: false
        },
        {
            keys: ['help'],
            description: 'Summons the help tab',
            staffOnly: false
        },
        {
            keys: ['commands', 'macros'],
            description: 'Summons the commands list',
            staffOnly: false
        },
        {
            keys: ['skip', 'next'],
            description: 'Skips the currently playing video',
            staffOnly: true
        },
        {
            keys: ['settings'],
            description: `Summons a window with the settings of the box, allowing you to adjust options
            such as the modes of play`,
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
