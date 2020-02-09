import { Component, OnInit, Input } from '@angular/core';

export interface ButtonOptions {
    type?: 'play' | 'replay' | 'cancel' | 'skip'
    context?: 'primary' | 'secondary' | 'default' | 'warning' | 'default'
}

@Component({
    selector: 'app-bx-button',
    templateUrl: './bx-button.component.html',
    styleUrls: ['./bx-button.component.scss']
})
export class BxButtonComponent implements OnInit {
    @Input() options: ButtonOptions

    computedOptions: ButtonOptions = {
        context: 'default'
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
