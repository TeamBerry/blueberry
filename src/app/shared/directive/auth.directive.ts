import { Directive, OnInit, AfterViewInit, OnDestroy, Input, ElementRef } from '@angular/core';
import * as moment from 'moment';

@Directive({
    selector: '[appAuth]',
})
export class AuthDirective implements OnInit, AfterViewInit, OnDestroy {
    // tslint:disable-next-line:no-input-rename
    @Input('auth') display: boolean;

    constructor(
        private element: ElementRef
    ) { }

    ngOnInit() {
        console.log('applying');
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
        const isLogged = moment().isBefore(moment(JSON.parse(localStorage.getItem('expires_at'))));
        if (this.display !== isLogged) {
            console.log('HIDE ELEMENT', this.element);
            this.element.nativeElement.style.display = 'none';
        }
    }
}
