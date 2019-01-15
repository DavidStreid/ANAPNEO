import { Injectable }       from '@angular/core';
import { LocationService }  from '../services/location.service';

@Injectable()
export class UserProfileService {

  public userProfile: Object = {
    coordinates: { 'latitude': null, 'longitude': null },
    authToken: null
  }

  constructor(private locationService:LocationService){
    this.getCoordinates();
  }

  getAuthToken(): string {
    return this.userProfile[ 'authToken' ];
  }

  setAuthToken(authToken: string): void {
    this.userProfile[ 'authToken' ] = authToken;
  }

	getCoordinates(){
		this.locationService.getCoordinates().subscribe( {
      next: (res) => this.userProfile['coordinates'] = res,
      error: (e) => console.log('Could not determine locations: ' + e),
    } )
  };
}
