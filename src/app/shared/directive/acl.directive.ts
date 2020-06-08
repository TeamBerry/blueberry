import { Directive, TemplateRef, ViewContainerRef, Input } from "@angular/core";

@Directive({
    selector: '[appAcl]',
})
export class ACLDirective {
    permissions: Array<string> = JSON.parse(localStorage.getItem('BBOX-Scope'))

    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef
    ) { }

    @Input() set appAcl(permission: string) {
        // Account for negation (berries)
        if (permission.charAt(0) === '!') {
            if (!this.permissions.includes(permission.substr(1)) && !this.permissions.includes('isAdmin')) {
                this.viewContainer.createEmbeddedView(this.templateRef);
            } else {
                this.viewContainer.clear();
            }
        } else {
            if (this.permissions.includes(permission) || this.permissions.includes('isAdmin')) {
                this.viewContainer.createEmbeddedView(this.templateRef);
            } else {
                this.viewContainer.clear();
            }
        }
    }
}