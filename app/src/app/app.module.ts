import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './Router/app-routing.module';

// ROOT Component
import { AppComponent } from './app.component';

// CHILD Components
import { VendorLocatorComponent } from '../vendorLocator/vendorLocator.component';
import { VendorComponent } from '../vendorLocator/vendorComponent/vendor.component';
import { HeaderComponent } from '../header/header.component';
import { RewardsComponent } from '../vendorLocator/rewardsComponent/rewards.component';
import { MyHealthComponent } from '../myHealthComponent/myHealth.component';
import { AppointmentsComponent } from '../appointmentsComponent/appointments.component';
import { PageNotFoundComponent } from '../pageNotFoundComponent/pageNotFound.component';

// Services
import { LocationService } from '../services/location.service';
import { UserProfileService } from '../userProfile/userProfile.service';

const SERVICES = [ LocationService, UserProfileService ];
const COMPONENTS =  [
                      VendorLocatorComponent,
                      VendorComponent,
                      HeaderComponent,
                      RewardsComponent,
                      MyHealthComponent,
                      AppointmentsComponent,
                      PageNotFoundComponent
                    ];

@NgModule({
  declarations: [
    AppComponent,
    COMPONENTS
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [ SERVICES ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
