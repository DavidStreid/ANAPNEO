import { Component } from '@angular/core';
import { UserProfileService } from '../userProfile/userProfile.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private userProfileService:UserProfileService){}
}
