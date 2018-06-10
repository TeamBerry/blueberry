import { Directive, OnInit, AfterViewInit, Input, ElementRef } from '@angular/core';
import * as moment from 'moment';

@Directive({
    selector: '[appAuth]',
})
export class AuthDirective implements OnInit, AfterViewInit {
    // tslint:disable-next-line:no-input-rename
    @Input('appAuth') display: string;

    constructor(
        private element: ElementRef
    ) { }

    ngOnInit() {
        this.apply();
    }

    ngAfterViewInit() {
        this.apply();
    }

    /**
     * Applies the logic of the directive to the DOM.
     *
     * TODO: Create/Destroy DOM elements instead of simply hiding them.
     *
     * @memberof AuthDirective
     */
    apply() {
        // "Casting" the string to boolean
        const isDisplay = (this.display === 'true');

        // Get the isLogged boolean
        const isLogged = moment().isBefore(moment(JSON.parse(localStorage.getItem('expires_at'))));

        // Compare both bools
        if (isDisplay === isLogged) {
            this.element.nativeElement.style.display = 'none';
        }
    }
}
