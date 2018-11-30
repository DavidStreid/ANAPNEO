import { Injectable } from '@angular/core';
import { HttpClient, HttpResponseBase, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject }    from 'rxjs/Subject';

@Injectable()
export class LoginService {
  private loggingEnabled: boolean = false;
  public loginSource = new Subject<Object>(); 	// Provides filter updates to the library

  constructor(private http: HttpClient){}

  login(userId: String, pwd: String): Observable<Object> {
    if( this.loggingEnabled ) console.log( "loginService::login" );

    const url = "http://localhost:4300/login";
    const body = { userId, pwd };

    return this.http.post( url, body )
        .map((response: HttpResponseBase) => response)
        .catch((error: HttpErrorResponse ) => Observable.throw(error));
  }
}
