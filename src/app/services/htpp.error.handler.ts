import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, Observable, throwError } from "rxjs";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private router: Router){

    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(catchError(err => {

            if (err instanceof HttpErrorResponse) {

                if (err.status === 401) {
                    localStorage.removeItem('eio.token');
                    localStorage.removeItem('eio.user');
                    this.router.navigate(['/entrar']);
                }
                if (err.status === 403) {
                    this.router.navigate(['/acesso-negado']);
                }
                if (err.status === 404) {
                    this.router.navigate(['/nao-encontrado']);
                }
            }

            return throwError(err);
        }));
    }

}