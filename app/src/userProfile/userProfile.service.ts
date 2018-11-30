import { Injectable }       from '@angular/core';
import { LocationService }  from '../services/location.service';
import { LoginService }     from '../services/login.service';

@Injectable()
export class UserProfileService {
  private logging: boolean = false;

  public userProfile: Object = {
    coordinates: {},
    authToken: null
  }

  constructor(private locationService:LocationService, private loginService:LoginService){
    this.retrieveCoordinates();
    this.login();
  }

  login(){
    this.loginService.login("David","dumbPassword").subscribe({
      next: (res) => this.userProfile['authToken'] = res['authToken'] || null,
      error: (e) => console.log('User Login Failed: ' + e)
    });
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
