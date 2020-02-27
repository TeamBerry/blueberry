import { Component, OnInit, Input } from '@angular/core';
import { AuthSubject } from 'app/shared/models/session.model';

@Component({
    selector: 'app-search-tab',
    templateUrl: './search-tab.component.html',
    styleUrls: ['./search-tab.component.scss']
})
export class SearchTabComponent implements OnInit {
    @Input() boxToken: string;
    @Input() user: AuthSubject;

    constructor() { }

    ngOnInit() {
        console.log(this.user);
    }

}
