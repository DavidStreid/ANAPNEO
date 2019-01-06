import { Component }              from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { UserProfileService }     from '../userProfile/userProfile.service';

@Component({
  selector: 'user-login',
  templateUrl: 'login.component.html',
  styleUrls: [ 'login.component.scss' ]
})

export class LoginComponent {
  // TODO - Add logger (make seperate class/util)

  constructor(private userProfileService: UserProfileService){}

  loginForm = new FormGroup({
    user: new FormControl(''),
    password: new FormControl(''),
  });

  onSubmit() {
    let user = this.loginForm.value.user;
    let password = this.loginForm.value.password;
    this.userProfileService.login(user, password);
  }

  // TODO -
  // Disabeled/Validation Logic
  // [disabled]="!loginForm.valid"
  // type="submit"
}
