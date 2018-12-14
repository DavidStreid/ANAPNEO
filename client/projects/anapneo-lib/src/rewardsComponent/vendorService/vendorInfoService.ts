import { Injectable } from '@angular/core';
import { HttpClient, HttpResponseBase, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of'
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class VendorInfoService {
  private loggingEnabled: boolean = true;
  constructor(private http: HttpClient){}

  public getVendors(userId: String) {
    if( this.loggingEnabled ) console.log( "VendorInfoService::getVendors" );

    const url = "http://localhost:4300/vendors?userId=" + userId;
    return this.http.get(url).pipe(
      map((response: HttpResponseBase) => { return response }),
      catchError((error: HttpErrorResponse ) =>  of(`Error: ${error}`)));
  }
}
