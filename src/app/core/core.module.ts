import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NavComponent } from './nav/nav.component';
import { throwIfAlreadyLoaded } from './module-import-guard';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        HttpClientModule,
        NgbModule.forRoot()
    ],
    declarations: [
        NavComponent
    ],
    exports: [
        NavComponent
    ],
    providers: []
})
export class CoreModule {
    constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
        throwIfAlreadyLoaded(parentModule, 'CoreModule');
    }
}