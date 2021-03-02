import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Permission, Role } from '@teamberry/muscadine';
@Component({
  selector: 'app-role-selector',
  templateUrl: './role-selector.component.html',
  styleUrls: ['./role-selector.component.scss']
})
export class RoleSelectorComponent implements OnInit {
    @Input() permissions: Array<Permission> = [];
    @Input() context: Exclude<Role, 'admin'>;

    @Output() selectedRole: EventEmitter<Exclude<Role, 'admin'>> = new EventEmitter();

    constructor() { }

    ngOnInit() {}

}
