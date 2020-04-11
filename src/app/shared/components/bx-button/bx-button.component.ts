import { Component, OnInit, Input } from '@angular/core';

export interface ButtonOptions {
    /**
     * Type of action of the button. Will determine the icon and the default text
     *
     * @type {('play' | 'replay' | 'cancel' | 'skip')}
     * @memberof ButtonOptions
     */
    type: 'play' | 'replay' | 'cancel' | 'skip' | 'addToLibrary' | 'preselect',
    /**
     * Context of the button. Will affect its display
     *
     * @type {('primary' | 'secondary' | 'default' | 'warning' | 'default')}
     * @memberof ButtonOptions
     */
    context?: 'primary' | 'secondary' | 'danger' | 'warning' | 'default' | 'queue',
    /**
     * Button text. Will default to the type if not specified
     *
     * @type {string}
     * @memberof ButtonOptions
     */
    text?: string,
    /**
     * Whether the text must be displayed in the button or in a tooltip
     *
     * @type {('button' | 'tooltip')}
     * @memberof ButtonOptions
     */
    textDisplay?: 'button' | 'tooltip'
}

@Component({
    selector: 'app-bx-button',
    templateUrl: './bx-button.component.html',
    styleUrls: ['./bx-button.component.scss']
})
export class BxButtonComponent implements OnInit {
    @Input() options: ButtonOptions

    computedOptions: ButtonOptions = {
        type: 'play'
    }

    buttonText = ''

    constructor() { }

    ngOnInit() {
        this.computedOptions.context = this.options.context || 'default'
        this.computedOptions.type = this.options.type
        this.computedOptions.text = this.options.text || this.options.type
        this.computedOptions.textDisplay = this.options.textDisplay || 'button'

        this.buttonText = this.buildText(this.computedOptions.text)
    }

    buildText(text: string) {
        return text[0].toUpperCase() + text.slice(1)
    }

}
