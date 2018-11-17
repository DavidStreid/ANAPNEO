import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from "rxjs/Observable";
import { Subject }    from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class LocationService {
  constructor(private http:Http){}

	public coordinatesSource = new Subject<Object>(); 	// Provides filter updates to the library
	private loggingEnabled: boolean = false;
	public locationEnabled: boolean = false;			// Set to true when navigator returns coordinates

	findCoordinates(){
		if( this.loggingEnabled ) console.log( "LocationService::findCoordinates" );
		navigator.geolocation.getCurrentPosition(
			pos => {
				let coordinates = {
					'latitude': pos['coords']['latitude'],
					'longitude': pos['coords']['longitude']
				};
				this.coordinatesSource.next( coordinates );
				this.locationEnabled = true;
				if( this.loggingEnabled ) { console.log(coordinates); };

			},
			error => { console.warn(); },
			// Options
			{	enableHighAccuracy: true,	timeout: 5000,	maximumAge: 0 }
		)
  }
}
