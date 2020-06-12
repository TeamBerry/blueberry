import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = localStorage.getItem('BBOX-token');

        if (token && !request.url.includes('googleapis')) {
            const cloned = request.clone({
                headers: request.headers.set('Authorization', 'Bearer ' + token)
            });

            return next.handle(cloned);
        } else {
            return next.handle(request);
        }
    }
}
