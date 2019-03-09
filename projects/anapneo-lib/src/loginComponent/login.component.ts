import { Component, Output, EventEmitter }  from '@angular/core';
import { FormGroup, FormControl }           from '@angular/forms';
import { Subject }                          from 'rxjs';

import { UserProfileService }   from '../userProfile/userProfile.service';
import { LoginService }         from '../services/login-service/login.service';
import TYPES                    from '../common-components/alertSelfClosingComponent/alert-constants';
import EncryptUtil              from '../utils/encrypt.util';
import LoggerUtil               from '../utils/logger.util';

@Component({
  selector: 'user-login',
  templateUrl: 'login.component.html',
  styleUrls: [ 'login.component.scss' ]
})

export class LoginComponent {

  constructor(private userProfileService: UserProfileService, private loginService: LoginService) {
    this.init();
  }
  private devGuide = 'Try \'DavidStreid\'/\'test\'';

  // ngbd-alert-selfclosing params
  msgSubject = new Subject<string>();
  msgLifeTime = 7000;
  statusMsg = `Hi! We're under construction. ${this.devGuide}`;
  alertType: string = TYPES.INFO;

  // TODO - Add logger (make seperate class/util)
  private encryptUtil;
  private logger: any;

  @Output() isLoggedIn: EventEmitter<any> = new EventEmitter();

  loginForm = new FormGroup({
    user: new FormControl(''),
    password: new FormControl(''),
  });

  init() {
    // Create utils
    this.encryptUtil = new EncryptUtil();
    this.logger = new LoggerUtil();
  }

  onSubmit() {
    const user = this.loginForm.value.user;
    const password = this.loginForm.value.password;
    this.login(user, password);
  }

  login(user: String, password: String) {
    this.logger.debug( `User: ${user}, Password: ${password}` );

    const encodedUser = this.encryptUtil.encrypt(user);
    const encodedPassword = this.encryptUtil.encrypt(password);

    this.loginService.login(encodedUser, encodedPassword).subscribe({
      next: ( loginStatus: Object ) => {
        if ( loginStatus[ 'success' ] ) {
          this.logger.debug( `Login Successful` );
          this.isLoggedIn.emit(true);
        } else {
          const error = loginStatus[ 'status' ] || 'ERROR';
          this.pushStatus(`${error}. ${this.devGuide}`, TYPES.DANGER);
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

  // TODO - Figure out how to remove all the boilerplate stuff
  /**
   * Modifies statusMsg and type and publishes from subject
   */
  pushStatus(status, type): void {
    this.statusMsg = status;
    this.alertType = type;
    this.msgLifeTime = 3000;
    this.msgSubject.next(this.statusMsg);
  }

  // TODO -
  // Disabeled/Validation Logic
  // [disabled]="!loginForm.valid"
  // type="submit"
}
