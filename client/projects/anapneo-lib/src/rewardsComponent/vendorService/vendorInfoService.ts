import { Injectable } from '@angular/core';
import { HttpClient, HttpResponseBase, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of'
import { map, catchError } from 'rxjs/operators';

import ResponseHandlerUtil from '../../utils/services/responseHandler.util';

@Injectable()
export class VendorInfoService {
  // TODO - Make logging util
  private loggingEnabled: boolean = false;
  private responseHandlerUtil: ResponseHandlerUtil;

  constructor(private http: HttpClient){
    this.responseHandlerUtil = new ResponseHandlerUtil();
  }

  // TODO - Add correct return types
  public getVendors(userId: String) {
    if( this.loggingEnabled ) console.log( "VendorInfoService::getVendors" );

    const url = "http://localhost:4300/vendors?userId=" + userId;
    return this.http.get(url).pipe(
      map((response: HttpResponseBase) => {
        console.log('Successful getVendors request');
        return response
      }),
      catchError((error: HttpErrorResponse ) => this.responseHandlerUtil.handleError(error)));
  }
}
