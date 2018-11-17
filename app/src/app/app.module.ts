import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule }            from '@angular/http';

import { AppComponent } from './app.component';

// Services
import { LocationService } from '../services/location.service';
import { UserProfileService } from '../userProfile/userProfile.service';

const SERVICES = [ LocationService, UserProfileService ]

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpModule
  ],
  providers: [ SERVICES ],
  bootstrap: [AppComponent]
})
export class AppModule { }
