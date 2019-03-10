import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponseBase, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { map, catchError } from 'rxjs/operators';
import { environment } from './../../environment';

import { CookieService } from 'ngx-cookie-service';
import { UserProfileService } from '../../userProfile/userProfile.service';
import ResponseHandlerUtil from './../../utils/services/responseHandler.util';

@Injectable()
export class CheckInsService {
  // TODO - Make logging util
  private loggingEnabled = true;
  private responseHandlerUtil: ResponseHandlerUtil;

  constructor(private http: HttpClient,
              private userProfileService: UserProfileService,
              private cookieService: CookieService) {
    this.responseHandlerUtil = new ResponseHandlerUtil();
  }

  /**
   * Submits a pending check-in to be saved to the user's profile
   */
  public createPendingCheckIn(checkIn: Object, advocateName: String) {
    if ( this.loggingEnabled ) { console.log( 'CheckInsService::createPendingCheckIn' ); }
    const anapneoService = environment['anapneoService'] || null;

    // TODO - Error handling/backup logic
    if ( ! anapneoService ) {
      const err = 'Anapneo service url is not defined in config';
      return Observable.create( (observer) => { observer.error(err); } );
    }

    const req   = { checkIn, advocateName };

    const url = `${anapneoService}/submitPending`;
    return this.http.post(url, req, { withCredentials: true }).pipe(
      map((response: HttpResponseBase) => response),
      catchError((error: HttpErrorResponse ) => this.responseHandlerUtil.handleError(error)));
  }

  public updateCheckIn(checkIn: Object, advocate: string) {
    if ( this.loggingEnabled ) { console.log( 'CheckInsService::updateCheckIn' ); }
    const anapneoService = environment['anapneoService'] || null;

    // TODO - Error handling/backup logic
    if ( ! anapneoService ) {
      const err = 'Anapneo service url is not defined in config';
      return Observable.create( (observer) => { observer.error(err); } );
    }

    const req   = { checkIn, advocate };
    const url = `${anapneoService}/updateCheckIn`;

    return this.http.post(url, req, { withCredentials: true }).pipe(
      map((response: HttpResponseBase) => {
        console.log('Successful submitCheckIn request');
        return response;
      }),
      catchError((error: HttpErrorResponse ) => this.responseHandlerUtil.handleError(error)));
  }

  public getCheckIns() {
    if ( this.loggingEnabled ) { console.log( 'CheckInsService::getCheckIns' ); }
    const anapneoService = environment['anapneoService'] || null;

    // TODO - Error handling/backup logic
    if ( ! anapneoService ) {
      const err = 'Anapneo service url is not defined in config';
      return Observable.create( (observer) => { observer.error(err); } );
    }

    const url = `${anapneoService}/checkIns`;
    return this.http.get(url).pipe(
      map((response: HttpResponseBase) => {
        console.log('Successful getCheckIns request');
        return response;
      }),
      catchError((error: HttpErrorResponse ) => this.responseHandlerUtil.handleError(error)));
  }
}
