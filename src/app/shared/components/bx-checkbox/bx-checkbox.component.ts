import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-bx-checkbox',
    templateUrl: './bx-checkbox.component.html',
    styleUrls: ['./bx-checkbox.component.scss']
})
export class BxCheckboxComponent implements OnInit {
    @Input() value: boolean;
    @Output() valueChange: EventEmitter<any> = new EventEmitter(null);

    constructor() { }

    ngOnInit() {
        this.valueChange.emit(this.value);
    }

    /**
     * When a click is registered, it toggles the slider. We get the value back from the chain of events, sent
     * by the checkbox inside of it
     *
     * @param {*} event
     * @memberof SlideToggleComponent
     */
    emitValue(event) {
        this.valueChange.emit(event.target.checked);
    }

}
