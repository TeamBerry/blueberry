import { Component, OnInit } from '@angular/core';

interface Permission {
    key: string,
    name: string,
    explanation: string
}

@Component({
    selector: 'app-acl-manager',
    templateUrl: './acl-manager.component.html',
    styleUrls: ['./acl-manager.component.scss']
})
export class AclManagerComponent implements OnInit {
    public queuePermissions: Array<Permission> = [
        {
            key: 'addVideo',
            name: 'Add a video to the Queue',
            explanation: null
        },
        {
            key: 'removeVideo',
            name: 'Remove a video from the Queue',
            explanation: null
        },
        {
            key: 'forceNext',
            name: 'Force the next video',
            explanation: null
        },
        {
            key: 'forcePlay',
            name: 'Plays another video instead of the currently playing',
            explanation: null
        },
        {
            key: 'skipVideo',
            name: 'Skips the currently playing video',
            explanation: null
        }
    ]

    public boxPermissions: Array<Permission> = [
        {
            key: 'editBox',
            name: 'Edit Box',
            explanation: null
        }
    ]

    public userPermissions: Array<Permission> = [
        {
            key: 'promote',
            name: 'Promote an user to VIP',
            explanation: null
        },
        {
            key: 'demote',
            name: 'Demote an user from VIP to Community Member',
            explanation: null
        }
    ]

    constructor() { }

    ngOnInit() {
    }

}
