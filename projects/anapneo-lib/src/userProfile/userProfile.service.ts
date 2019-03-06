import { Injectable }       from '@angular/core';
import { LocationService }  from '../services/location.service';

@Injectable()
export class UserProfileService {

  public userProfile: Object = {
    coordinates: { 'latitude': null, 'longitude': null }
  };

  constructor(private locationService: LocationService) {
    this.getCoordinates();
  }

  getCoordinates() {
    this.locationService.getCoordinates().subscribe( {
      next: (res) => this.userProfile['coordinates'] = res,
      error: (e) => console.log('Could not determine locations: ' + e),
    } );
  }
}
