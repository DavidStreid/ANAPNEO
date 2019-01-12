import { Injectable }       from '@angular/core';
import { LocationService }  from '../services/location.service';
import { LoginService }     from '../services/login.service';
import EncryptUtil from '../utils/encrypt.util';
import LoggerUtil from '../utils/logger.util';

@Injectable()
export class UserProfileService {
  private encryptUtil;
  private logger: any;

  public userProfile: Object = {
    coordinates: { 'latitude': null, 'longitude': null },
    authToken: null
  }

  constructor(private locationService:LocationService, private loginService:LoginService){
    this.getCoordinates();
    this.encryptUtil = new EncryptUtil();
    this.logger = new LoggerUtil();

    // TODO - Remove once login feature is fully integrated
    this.login("DavidStreid","test");  // GOOD LOGIN
    // this.login("NO_NAME","123");          // BAD LOGIN
  }

  getAuthToken( ): string {
    return this.userProfile[ 'authToken' ];
  }

  login(user: String, password: String){
    this.logger.debug( `User: ${user}, Password: ${password}` );

    const encodedUser = this.encryptUtil.encrypt(user);
    const encodedPassword = this.encryptUtil.encrypt(password);

    this.loginService.login(encodedUser, encodedPassword).subscribe({
      next: ( loginStatus: Object ) => {
        if( loginStatus[ 'success' ] ){
          const token = loginStatus['token'];
          if( token ){
            this.logger.debug( `Login Successful - token: ${token}` );
            this.userProfile['authToken'] = token;
          }
          else {
            this.handleLoginFailure('Login Unsuccessful: login token is null');
          }
        } else {
          const error = loginStatus[ 'status' ] || 'ERROR';
          this.handleLoginFailure(`Login Unsuccessful: ${error}`);
        }
      },
      error: (e) => console.error('User Login Failed: ' + e)
    });
  }

  handleLoginFailure(msg) {
    this.logger.log( msg );
    // TODO - add a modal that will prompt the user to login again and give the reason why
  }

	getCoordinates(){
		this.locationService.getCoordinates().subscribe( {
      next: (res) => this.userProfile['coordinates'] = res,
      error: (e) => console.log('Could not determine locations: ' + e),
    } )
  };
}
