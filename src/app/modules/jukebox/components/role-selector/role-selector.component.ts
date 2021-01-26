import { Component, Input, OnInit } from '@angular/core';
import { Permission } from '@teamberry/muscadine';

@Component({
  selector: 'app-role-selector',
  templateUrl: './role-selector.component.html',
  styleUrls: ['./role-selector.component.scss']
})
export class RoleSelectorComponent implements OnInit {
    @Input() availableActions: Array<string>;
    @Input() context: 'moderator' | 'vip' | 'simple';
    
  constructor() { }

    ngOnInit() {
        console.log(this.availableActions);
  }

}
