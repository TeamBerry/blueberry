import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[settings-host]'
})
export class SettingsDirective {

    constructor(public viewContainerRef: ViewContainerRef) { }

}
