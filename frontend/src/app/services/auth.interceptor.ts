import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

// TODO: Auth Interceptor implementieren - Bearer Token automatisch setzen
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    console.log('[AuthInterceptor] aktiv für:', request.url);
    const token = localStorage.getItem('accessToken');
    if (token) {
      console.log('[AuthInterceptor] Token gefunden:', token);
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    } else {
      console.log('[AuthInterceptor] Kein Token im LocalStorage gefunden');
    }
    return next.handle(request);
  }
}
