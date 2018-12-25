import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from "rxjs/Observable";
import { Observer } from "rxjs/Observer";
import { Subject }    from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class LocationService {
  private loggingEnabled: boolean = false;
  constructor(private http: HttpClient){}

  private getCurrentPosition(observer: Observer<Object>): void {
    navigator.geolocation.getCurrentPosition(
      pos => {
        let coordinates = {
          'latitude': pos['coords']['latitude'],
          'longitude': pos['coords']['longitude']
        };
        if( this.loggingEnabled ) console.log( 'Obtained coordinates: ' + JSON.stringify(coordinates) );

        observer.next(coordinates);
        observer.complete();
      },
      error => { console.warn(); observer.complete(); },

      // Options
      {	enableHighAccuracy: true,	timeout: 5000,	maximumAge: 0 }
    );
  }

	public getCoordinates(): Observable<any> {
		if( this.loggingEnabled ) console.log( "LocationService::getCoordinates" );
    return Observable.create( observer => { this.getCurrentPosition(observer) } );
  }
}
