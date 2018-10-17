import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[settings-host]'
})
export class SettingsDirective {

    constructor(public viewContainerRef: ViewContainerRef) { }

}
