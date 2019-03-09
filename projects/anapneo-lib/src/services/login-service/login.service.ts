import { Injectable } from '@angular/core';
import { HttpClient, HttpResponseBase, HttpErrorResponse } from '@angular/common/http';
import { Observable }       from 'rxjs/Observable';
import { map, catchError }  from 'rxjs/operators';
import { environment }      from '../../environment';
import { CookieService } from 'ngx-cookie-service';

import ResponseHandlerUtil  from '../../utils/services/responseHandler.util';
import BrowserUtil          from '../../utils/browser.util';

@Injectable()
export class LoginService {
  private loggingEnabled = false;
  anapneoService: String;

  private responseHandlerUtil: ResponseHandlerUtil;
  private browserUtil: BrowserUtil;

  constructor(private http: HttpClient, private cookieService: CookieService) {
    this.init();
  }

  init() {
    this.anapneoService = environment['anapneoService'] || null;
    this.responseHandlerUtil = new ResponseHandlerUtil();
    this.browserUtil = new BrowserUtil();
  }

  public login(userId: String, pwd: String): Observable<Object> {
    // TODO - Add logging util
    if ( this.loggingEnabled ) { console.log( 'loginService::login' ); }

    // TODO - Error handling/backup logic
    if ( ! this.anapneoService ) {
      const err = 'Anapneo service url is not defined in config';
      return Observable.create( (observer) => { observer.error(err); } );
    }

    // Safari does not allow third-party cookies, eg. b.com sets cookie on a.com. For now, we'll put the session token in the resp body
    const isSafari: boolean = this.browserUtil.isBrowser('safari');
    const body = { userId, pwd, putTokenInResponse: isSafari };

    const url = `${this.anapneoService}/login`;
    return this.http.post( url, body, { withCredentials: true } ).pipe(
      map((res: HttpResponseBase) => {
        const success = res['success'] || false;
        if ( success ) {
          console.log('Successful login');
          // If login was succcessful and the browser is safari, we'll take the token in the response and add it as a token
          if ( isSafari && res['token'] ) {
            this.cookieService.set( 'session', res['token'] );
          }
          return res;
        } else {
          const status = res['status'] || 'Status unknown';
          return { success: false, status };
        }
      }),
      catchError( ( error: HttpErrorResponse ) => this.responseHandlerUtil.handleError(error) )
    );
  }
}
