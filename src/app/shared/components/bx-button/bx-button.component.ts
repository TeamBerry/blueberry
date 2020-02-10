import { Component, OnInit, Input } from '@angular/core';

export interface ButtonOptions {
    type?: 'play' | 'replay' | 'cancel' | 'skip',
    tooltip?: string,
    context?: 'primary' | 'secondary' | 'default' | 'warning' | 'default',
    text?: boolean
}

@Component({
    selector: 'app-bx-button',
    templateUrl: './bx-button.component.html',
    styleUrls: ['./bx-button.component.scss']
})
export class BxButtonComponent implements OnInit {
    @Input() options: ButtonOptions

    computedOptions: ButtonOptions = {
        context: 'default',
        text: false
    }

    constructor() { }

    ngOnInit() {
        Object.keys(this.options).map(
            (key) => {
                this.computedOptions[key] = this.options[key]
            }
        )
    }

}
