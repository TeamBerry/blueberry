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
                    name: 'Force the next video',
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
                }
            ]
        },
        {
            name: 'User Actions',
            permissions: [
                {
                    key: 'promote',
                    name: 'Promote an user to VIP',
                    explanation: null,
                    withBerries: false
                },
                {
                    key: 'demote',
                    name: 'Demote an user from VIP to Community Member',
                    explanation: null,
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
