import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { UtilsServiceService } from '../services/utils-service.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private utils: UtilsServiceService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const currentUser: any = this.utils.getSessionData('currentUser');

        if (Boolean(currentUser) && currentUser.access_token) {
            request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + currentUser.access_token) });
        }

        if (!request.headers.has('Content-Type')) {
            // request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
        }

        request = request.clone({ headers: request.headers.set('Accept', 'application/json') });

        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    //If you need to modify response
                }
                return event;
            }),
            catchError((error: HttpErrorResponse) => { //Handal all http errors
                if (Boolean(error.error.message)) {
                    this.utils.showSnackBar(error.error.message, { panelClass: 'error' });
                } else {
                    this.utils.showSnackBar("Something went wrong", { panelClass: 'error' });
                }

                return throwError(error);
            }));
    }
}