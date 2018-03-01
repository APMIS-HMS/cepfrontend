import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpEvent, HttpRequest } from '@angular/common/http';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    intercept(req, next) {
      console.log('am in');
        const token = localStorage.getItem('token');
        const authRequest = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`)
        });
        return next.handle(authRequest);
    }
}
