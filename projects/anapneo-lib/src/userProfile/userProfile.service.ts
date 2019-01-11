import { Injectable }       from '@angular/core';
import { LocationService }  from '../services/location.service';
import { LoginService }     from '../services/login.service';
import EncryptUtil from '../utils/encrypt.util';

@Injectable()
export class UserProfileService {
  private logging: boolean = true;
  private encryptUtil;

  public userProfile: Object = {
    coordinates: { 'latitude': null, 'longitude': null },
    authToken: null
  }

  constructor(private locationService:LocationService, private loginService:LoginService){
    this.getCoordinates();
    this.encryptUtil = new EncryptUtil();

    // TODO - Remove once login feature is fully integrated
    this.login("David","dumbPassword");
  }

  login(user: String, password: String){
    if( this.logging ) console.log( 'User: ' + user + ', Password: ' + password );

    const encodedUser = this.encryptUtil.encrypt(user);
    const encodedPassword = this.encryptUtil.encrypt(password);

    this.loginService.login(encodedUser, encodedPassword).subscribe({
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
