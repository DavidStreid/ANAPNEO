import { Injectable } from '@angular/core';
import { HttpClient, HttpResponseBase, HttpErrorResponse } from '@angular/common/http';
import { Observable }       from 'rxjs/Observable';
import { map, catchError }  from 'rxjs/operators';
import { environment }      from '../../environment';

import ResponseHandlerUtil from '../../utils/services/responseHandler.util';

@Injectable()
export class LoginService {
  private loggingEnabled = false;
  anapneoService: String;

  private responseHandlerUtil: ResponseHandlerUtil;

  constructor(private http: HttpClient) {
    this.init();
  }

  init() {
    this.anapneoService = environment['anapneoService'] || null;
    this.responseHandlerUtil = new ResponseHandlerUtil();
  }

  public login(userId: String, pwd: String): Observable<Object> {
    // TODO - Add logging util
    if ( this.loggingEnabled ) { console.log( 'loginService::login' ); }

    // TODO - Error handling/backup logic
    if ( ! this.anapneoService ) {
      const err = 'Anapneo service url is not defined in config';
      return Observable.create( (observer) => { observer.error(err); } );
    }

    const url = `${this.anapneoService}/login`;
    const body = { userId, pwd };

    return this.http.post( url, body, { withCredentials: true } ).pipe(
      map((res: HttpResponseBase) => {
        const success = res['success'] || false;
        if ( success ) {
          console.log('Successful login');
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
