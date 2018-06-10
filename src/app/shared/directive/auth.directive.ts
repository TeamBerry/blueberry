import { Directive, OnInit, AfterViewInit, OnDestroy, Input, ElementRef } from '@angular/core';
import * as moment from 'moment';

@Directive({
    selector: '[appAuth]',
})
export class AuthDirective implements OnInit, AfterViewInit, OnDestroy {
    // tslint:disable-next-line:no-input-rename
    @Input('appAuth') display: string;

    constructor(
        private element: ElementRef
    ) {
        console.log('CONSTRUCTOR');
    }

    ngOnInit() {
        console.log('INIT');
        this.apply();
    }

    ngAfterViewInit() {
        console.log('applying');
        this.apply();
    }

    ngOnDestroy() {
        console.log('applying');
        this.apply();
    }

    apply() {
        // "Casting" the string to boolean
        const isDisplay = (this.display === 'true');

        // Get the isLogged boolean
        const isLogged = moment().isBefore(moment(JSON.parse(localStorage.getItem('expires_at'))));

        // Compare both bools
        if (isDisplay !== isLogged) {
            console.log('HIDE ELEMENT', this.element);
            this.element.nativeElement.style.display = 'none';
        }
    }
}
