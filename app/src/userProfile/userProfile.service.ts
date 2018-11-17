import{ Injectable } from '@angular/core';
import{ LocationService } from '../services/location.service';

@Injectable()
export class UserProfileService {
  private coordinates: Object = {}; // Location of the user in latitude and longitude
  private logging: boolean = false;

  public geoData: Object = {
    coordinates: {}
  }

  constructor(private locationService:LocationService){
    this.retrieveCoordinates();
  }

	retrieveCoordinates(){
		this.locationService.findCoordinates();				// Send Request For Coordinates
		this.locationService.coordinatesSource.subscribe(	// Subscribe to Source of Coordinates
			coordinates => {
				this.geoData['coordinates'] = coordinates;
        // console.log(JSON.stringify(this.geoData));
			}
		)
};
}
