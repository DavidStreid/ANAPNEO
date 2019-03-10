import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private cookieService: CookieService) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Add Session token if it is available (Should only be available on Safari)
    const sessionToken: string = this.cookieService.get('session');
    if( sessionToken ){
      request = request.clone({
        setHeaders: {
          withCredentials: 'true',
          Authorization: 'Bearer ' + sessionToken
        }
      });
    }
    return next.handle(request);
  }
}
