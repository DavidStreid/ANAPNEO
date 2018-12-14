import { Injectable } from '@angular/core';
import { HttpClient, HttpResponseBase, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class LoginService {
  private loggingEnabled: boolean = false;

  constructor(private http: HttpClient){}

  login(userId: String, pwd: String) {
    if( this.loggingEnabled ) console.log( "loginService::login" );

    const url = "http://localhost:4300/login";
    const body = { userId, pwd };

    return this.http.post( url, body ).pipe(
      map((response: HttpResponseBase) => {return response}),
      catchError((error: HttpErrorResponse ) => Observable.throw(error))
    );
  }
}
