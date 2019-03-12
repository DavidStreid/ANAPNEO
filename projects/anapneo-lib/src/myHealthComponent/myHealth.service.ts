import { Injectable } from '@angular/core';
import {HttpClient, HttpResponseBase, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { map, catchError } from 'rxjs/operators';

import { CookieService } from 'ngx-cookie-service';
import { environment }      from '../environment';
import { UserProfileService }     from '../userProfile/userProfile.service';
import ResponseHandlerUtil        from '../utils/services/responseHandler.util';

@Injectable()
export class MyHealthService {
  private shouldUpdate: boolean;      // toggle set by services on which MyHealthService depends
  private healthResponse: HttpResponseBase;
  private responseHandlerUtil: ResponseHandlerUtil;

  constructor(private http: HttpClient,
              private userProfileService: UserProfileService,
              private cookieService: CookieService) {
    this.responseHandlerUtil = new ResponseHandlerUtil();
  }

  public setShouldUpdate(shouldUpdate: boolean){
    this.shouldUpdate = shouldUpdate;
  }

  /**
   * Returns the health data of a user
   * @param force - Toggle to force a service call for the user
   */
  getHealthProfile(): Observable<HttpResponseBase> {
    // Return cached response if it has been set and no service has toggled shouldUpdate
    if( this.healthResponse && !this.shouldUpdate ){
      return of(this.healthResponse);
    }

    const anapneoService = environment['anapneoService'] || null;
    // TODO - Error handling/backup logic
    if ( ! anapneoService ) {
      const err = 'Anapneo service url is not defined in config';
      return Observable.create( (observer) => { observer.error(err); } );
    }
    const url = `${anapneoService}/health`;
    return this.http.get(url).pipe(
      map( (res: HttpResponseBase) => {
        this.healthResponse = res;
        this.shouldUpdate = false;    // Toggle shouldUpdate to false as the response is now the latest data
        return res;
      },
      catchError( (err: HttpErrorResponse) => this.responseHandlerUtil.handleError(err) ) )
    );
  }
}
