import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-slide-toggle',
    templateUrl: './slide-toggle.component.html',
    styleUrls: ['./slide-toggle.component.scss']
})
export class SlideToggleComponent implements OnInit {
    @Input() checked: boolean = true;
    @Output() toggle: EventEmitter<any> = new EventEmitter();

    constructor() { }

    ngOnInit() {
    }

}
