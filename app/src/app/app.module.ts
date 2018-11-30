import { BrowserModule }    from '@angular/platform-browser';
import { NgModule }         from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './Router/app-routing.module';

// ROOT Component
import { AppComponent } from './app.component';

// CHILD Components
import { RewardsComponent }             from '../rewardsComponent/rewards.component';
import { VendorComponent }              from '../rewardsComponent/vendorComponent/vendor.component';
import { HeaderComponent }              from '../header/header.component';
import { RewardsInfoComponent }         from '../rewardsComponent/rewardsInfoComponent/rewards-info.component';
import { MyHealthComponent }            from '../myHealthComponent/myHealth.component';
import { AppointmentTrackerComponent }  from '../appointmentTrackerComponent/appointment-tracker.component';
import { AppointmentDetailsComponent }  from '../appointmentTrackerComponent/appointmentDetailsComponent/appointment-details.component';
import { CalendarDateComponent }        from '../appointmentTrackerComponent/calendarDateComponent/calendar-date.component';
import { DocFinderComponent }           from '../docFinderComponent/doc-finder.component';

import { PageNotFoundComponent }        from '../pageNotFoundComponent/pageNotFound.component';


// Services
import { LocationService }    from '../services/location.service';
import { LoginService }       from '../services/login.service';
import { UserProfileService } from '../userProfile/userProfile.service';

const SERVICES    = [ LocationService, UserProfileService, LoginService ];
const COMPONENTS  = [
                      RewardsComponent,
                      RewardsInfoComponent,
                      VendorComponent,
                      HeaderComponent,
                      RewardsComponent,
                      PageNotFoundComponent,
                      AppointmentTrackerComponent,
                      AppointmentDetailsComponent,
                      CalendarDateComponent,
                      DocFinderComponent,
                      MyHealthComponent
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
