import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { LOCAL_STORAGE } from 'src/app/utils/constants';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService {

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token: string = localStorage.getItem(LOCAL_STORAGE.USUARIO_TOKEN) ?? '';
    let request = req;
    if (token!==null) {
      request = req.clone({
        setHeaders: {
          authorization: `Bearer ${ token }`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        if ((err.status === 401) || (err.status === 403 && request.url.includes('auth/user'))) {
          this.authService.logout();
          this.router.navigateByUrl('/login');
        }
        return throwError(() => err);
      })
    );
  }

}
