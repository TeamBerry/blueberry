import { Directive, Input, ViewContainerRef, TemplateRef } from '@angular/core';
import { AuthService } from './../../core/auth/auth.service';

@Directive({
    selector: '[appAuth]',
})
export class AuthDirective {
    private isDisplayed = true;

    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef,
        private authService: AuthService
    ) { }

    /**
     * Creates the template inside the view container or clears said container depending on the condition given out by the DOM.
     *
     * This will NOT hide/show elements but render them if necessary.
     * Protects against the user tempering with the DOM via the insepctor console of their browser.
     *
     * @memberof AuthDirective
     */
    @Input() set appAuth(condition: boolean) {
        const isLogged = this.authService.isLoggedIn();

        if (condition === isLogged) {
            this.viewContainer.createEmbeddedView(this.templateRef);
            this.isDisplayed = true;
        } else {
            this.viewContainer.clear();
            this.isDisplayed = false;
        }
    }
}
