import { Component } from '@angular/core';
import { UserProfileService } from '../userProfile/userProfile.service';

@Component({
  selector: 'anapneo',
  templateUrl: './anapneo.component.html',
  styleUrls: ['./anapneo.component.scss']
})
export class AnapneoComponent {
  public validLogin: boolean;

  constructor(private userProfileService:UserProfileService){}

  isLoggedIn(evt){
    this.validLogin = evt;
  }
}
