import { Injectable }       from '@angular/core';
import { LocationService }  from '../services/location.service';
import { LoginService }     from '../services/login.service';

@Injectable()
export class UserProfileService {
  private logging: boolean = false;

  public userProfile: Object = {
    coordinates: { 'latitude': null, 'longitude': null },
    authToken: null
  }

  constructor(private locationService:LocationService, private loginService:LoginService){
    this.getCoordinates();
    this.login();
  }

  login(){
    this.loginService.login("David","dumbPassword").subscribe({
      next: (res) => this.userProfile['authToken'] = res['authToken'] || null,
      error: (e) => console.log('User Login Failed: ' + e)
    });
  }

	getCoordinates(){
		this.locationService.getCoordinates().subscribe( {
      next: (res) => this.userProfile['coordinates'] = res,
      error: (e) => console.log('Could not determine locations: ' + e),
    } )
  };
}
