import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-slide-toggle',
    templateUrl: './slide-toggle.component.html',
    styleUrls: ['./slide-toggle.component.scss']
})
export class SlideToggleComponent {
    @Input() value: boolean;
    @Output() valueChange: EventEmitter<any> = new EventEmitter(null);

    constructor() { }

    /**
     * When a click is registered, it toggles the slider. We get the value back from the chain of events, sent
     * by the checkbox inside of it
     *
     * @param event
     * @memberof SlideToggleComponent
     */
    emitValue(event) {
        this.valueChange.emit(event.target.checked);
    }

}
