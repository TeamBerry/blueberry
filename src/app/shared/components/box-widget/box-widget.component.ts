import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-box-widget',
    templateUrl: './box-widget.component.html',
    styleUrls: ['./box-widget.component.scss']
})
export class BoxWidgetComponent implements OnInit {

    @Input() box;

    constructor() { }

    ngOnInit() {
    }
}
