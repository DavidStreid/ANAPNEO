import { Injectable } from '@angular/core';
import { HttpClient, HttpResponseBase, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of'
import { map, catchError } from 'rxjs/operators';
import { environment }      from './../environment';

import { UserProfileService }     from '../userProfile/userProfile.service';
import ResponseHandlerUtil from './../utils/services/responseHandler.util';

@Injectable()
export class CheckInsService {
  // TODO - Make logging util
  private loggingEnabled: boolean = true;
  private responseHandlerUtil: ResponseHandlerUtil;

  constructor(private http: HttpClient, private userProfileService:UserProfileService){
    this.responseHandlerUtil = new ResponseHandlerUtil();
  }

  public getCheckIns() {
    if( this.loggingEnabled ) console.log( "CheckInsService::getCheckIns" );
    const anapneoService = environment['anapneoService'] || null;

    // TODO - Error handling/backup logic
    if( ! anapneoService ){
      const err = 'Anapneo service url is not defined in config';
      return Observable.create( (observer) => { observer.error(err) } );
    }

    const token = this.userProfileService.getAuthToken();

    const url = `${anapneoService}/checkIns?token=${token}`;
    return this.http.get(url).pipe(
      map((response: HttpResponseBase) => {
        console.log('Successful getCheckIns request');
        return response
      }),
      catchError((error: HttpErrorResponse ) => this.responseHandlerUtil.handleError(error)));
  }
}
