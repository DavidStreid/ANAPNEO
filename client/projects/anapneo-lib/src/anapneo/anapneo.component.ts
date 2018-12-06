import { Component } from '@angular/core';
import { UserProfileService } from '../userProfile/userProfile.service';

@Component({
  selector: 'anapneo',
  templateUrl: './anapneo.component.html',
  styleUrls: ['./anapneo.component.css']
})
export class AnapneoComponent {
  constructor(private userProfileService:UserProfileService){}
}
