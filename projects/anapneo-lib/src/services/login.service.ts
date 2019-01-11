import { Injectable } from '@angular/core';
import { HttpClient, HttpResponseBase, HttpErrorResponse } from '@angular/common/http';
import { Observable }       from 'rxjs/Observable';
import { map, catchError }  from 'rxjs/operators';
import { environment }      from '../environment';

import ResponseHandlerUtil from '../utils/services/responseHandler.util';

@Injectable()
export class LoginService {
  private loggingEnabled: boolean = false;

  private responseHandlerUtil: ResponseHandlerUtil;

  constructor(private http: HttpClient){
    this.responseHandlerUtil = new ResponseHandlerUtil();
  }

  login(userId: String, pwd: String) : Observable<Object>{
    // TODO - Add logging util
    if( this.loggingEnabled ) console.log( "loginService::login" );

    const anapneoService = environment['anapneoService'] || null;

    // TODO - Error handling/backup logic
    if( ! anapneoService ){
      const err = 'Anapneo service url is not defined in config';
      return Observable.create( (observer) => { observer.error(err) } );
    }

    const url = `${anapneoService}/login`;
    const body = { userId, pwd };

    return this.http.post( url, body ).pipe(
      map((res: HttpResponseBase) => {
        const success = res['success'] || false;
        if( success && res['token'] != null ){
          console.log('Successful login');
          const token = res[ 'token' ];
          return { success: true, token };
        } else {
          const status = res['status'] || 'Status unknown';
          return { success: false, status };
        }
      }),
      catchError( ( error: HttpErrorResponse ) => this.responseHandlerUtil.handleError(error) )
    );
  }
}
