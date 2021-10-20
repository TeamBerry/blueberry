import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { AngularSvgIconModule } from 'angular-svg-icon';

import { AuthService } from './auth/auth.service';
import { AuthInterceptor } from './auth/auth.interceptor';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpClientModule,
        AngularSvgIconModule.forRoot(),
        ToastrModule.forRoot({
            timeOut: 3000,
            positionClass: 'toast-bottom-right',
            preventDuplicates: true,
            progressBar: true
        }),
    ],
    declarations: [
    ],
    exports: [
    ],
    providers: [
        AuthService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        }
    ]
})
export class CoreModule {
    constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
        if (parentModule) {
            throw new Error(`CoreModule has already been loaded. Import Core modules in the AppModule only.`);
        }
    }
}
