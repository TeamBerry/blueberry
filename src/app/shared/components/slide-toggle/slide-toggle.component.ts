import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-slide-toggle',
    templateUrl: './slide-toggle.component.html',
    styleUrls: ['./slide-toggle.component.scss']
})
export class SlideToggleComponent implements OnInit {
    @Input() value: boolean;
    @Output() valueChange: EventEmitter<any> = new EventEmitter(this.value);

    constructor() { }

    ngOnInit() {
    }

}
