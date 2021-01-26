import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from 'app/shared/models/user.model';
import { UserService } from 'app/shared/services/user.service';

interface Permission {
    key: string,
    name: string,
    explanation: string,
    withBerries: boolean
}

@Component({
    selector: 'app-acl-form',
    templateUrl: './acl-form.component.html',
    styleUrls: ['./acl-form.component.scss']
})
export class AclFormComponent implements OnInit {
    public sections: Array<{ name: string, permissions: Array<Permission> }> = [
        {
            name: 'Queue Actions',
            permissions: [
                {
                    key: 'addVideo',
                    name: 'Add a video to the Queue',
                    explanation: null,
                    withBerries: false
                },
                {
                    key: 'bypassVideoDurationRestriction',
                    name: 'Bypass Video Duration Restriction',
                    explanation: 'Allows to ignore the video duration restriction set in place for the box',
                    withBerries: false
                },
                {
                    key: 'removeVideo',
                    name: 'Remove a video from the Queue',
                    explanation: null,
                    withBerries: false
                },
                {
                    key: 'skipVideo',
                    name: 'Skip the currently playing video',
                    explanation: null,
                    withBerries: true
                },
                {
                    key: 'forceNext',
                    name: 'Put a video into the priority queue',
                    explanation: null,
                    withBerries: true
                },
                {
                    key: 'forcePlay',
                    name: 'Play another video instead of the currently playing',
                    explanation: null,
                    withBerries: true
                }
            ]
        },
        {
            name: 'Box Actions',
            permissions: [
                {
                    key: 'editBox',
                    name: 'Edit Box',
                    explanation: null,
                    withBerries: false
                },
                {
                    key: 'bypassBerries',
                    name: 'Bypass Berries',
                    explanation: 'Allows to bypass any action that consumed berries. With this permission, skipping a video played with berries is possible.',
                    withBerries: false
                }
            ]
        },
        {
            name: 'User Actions',
            permissions: [
                {
                    key: 'setVIP',
                    name: 'Give VIP privileges to an user',
                    explanation: null,
                    withBerries: false
                },
                {
                    key: 'unsetVIP',
                    name: 'Remove VIP privileges from an user',
                    explanation: null,
                    withBerries: false
                },
                {
                    key: 'inviteUser',
                    name: 'Invite users to the box',
                    explanation: 'Allows users to generate an invite link to the box',
                    withBerries: false
                }
            ]
        }
    ]

    @Input() config: User['acl'] = {
        moderator: [],
        vip: [],
        simple: []
    }
    @Output() configChange: EventEmitter<User['acl']> = new EventEmitter();

    // 0: Moderator, 1: VIP, 2: Community Members
    editableConfig: Array<Object> = []
    // Dictionary of roles
    roles: Array<string> = ['moderator', 'vip', 'simple']
    // Dictionary of permissions
    allPermissionKeys: Array<string> = []

    constructor(
        private userService: UserService
    ) { }

    ngOnInit() {
        // Build dictionary of permissions
        this.sections.forEach(
            (section) => {
                this.allPermissionKeys.push(...section.permissions.map((permission) => permission.key))
            }
        )
        this.buildEditableConfig()
    }

    /**
     * Builds the editable config from the config given to the component and the dictionaries of roles & permissions
     *
     * @memberof AclFormComponent
     */
    buildEditableConfig() {
        for (const role of this.roles) {
            const config = {}
            const matchingSet = this.config[role]
            for (const key of this.allPermissionKeys) {
                config[key] = matchingSet.indexOf(key) !== -1
            }
            this.editableConfig.push(config);
        }
    }

    /**
     * Builds an updated version of the ACL Config of the user and emits it
     *
     * @memberof AclFormComponent
     */
    buildACLConfig() {
        const updatedConfig = {
            moderator: [],
            simple: [],
            vip: []
        }
        for (let i = 0; i < this.editableConfig.length; i++) {
            const currentRole = this.editableConfig[i];
            Object.keys(currentRole).map(
                (key: string) => {
                    if (currentRole[key]) {
                        updatedConfig[this.roles[i]].push(key)
                    }
                }
            )
        }
        this.configChange.emit(updatedConfig)
    }

}
