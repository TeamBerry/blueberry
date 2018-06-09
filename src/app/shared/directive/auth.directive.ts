import { Directive, OnInit, AfterViewInit, OnDestroy, Input, ElementRef } from "@angular/core";

@Directive({
    selector: '[auth]'
})
export class AuthDirective implements OnInit, AfterViewInit, OnDestroy {
    // tslint:disable-next-line:no-input-rename
    @Input('auth') display: string;

    constructor(
        private element: ElementRef
    ) { }

    ngOnInit() {
        this.apply();
    }

    ngAfterViewInit() {
        this.apply();
    }

    ngOnDestroy() {
        this.apply();
    }

    apply() {
        // Logic to hide parts of the DOM depending on if the user is logged or not
    }
}
