import { Injectable }       from '@angular/core';
import { LocationService }  from '../services/location.service';
import { LoginService }     from '../services/login.service';

@Injectable()
export class UserProfileService {
  private logging: boolean = true;

  public userProfile: Object = {
    coordinates: { 'latitude': null, 'longitude': null },
    authToken: null
  }

  constructor(private locationService:LocationService, private loginService:LoginService){
    this.getCoordinates();

    // TODO - Remove once login feature is fully integrated
    this.login("David","dumbPassword");
  }

  login(user: String, password: String){
    if( this.logging ) console.log( 'User: ' + user + ', Password: ' + password );
    this.loginService.login(user, password).subscribe({
      next: (res) => this.userProfile['authToken'] = res['authToken'] || null,
      error: (e) => console.error('User Login Failed: ' + e)
    });
  }

	getCoordinates(){
		this.locationService.getCoordinates().subscribe( {
      next: (res) => this.userProfile['coordinates'] = res,
      error: (e) => console.log('Could not determine locations: ' + e),
    } )
  };
}
