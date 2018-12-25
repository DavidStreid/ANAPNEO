import { CommonModule }           from '@angular/common';
import { NgModule }         from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AnapneoRoutingModule } from './Router/anapneo-routing.module';

// ROOT Component
import { AnapneoComponent } from './anapneo.component';

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
import { LoginComponent }               from '../loginComponent/login.component';
import { PageNotFoundComponent }        from '../pageNotFoundComponent/pageNotFound.component';
import { SideBarComponent }             from '../sidebar/sidebar.component';

// Services
import { LocationService }    from '../services/location.service';
import { LoginService }       from '../services/login.service';
import { UserProfileService } from '../userProfile/userProfile.service';
import { VendorInfoService }  from '../rewardsComponent/vendorService/vendorInfoService';

const SERVICES    = [ LocationService, UserProfileService, LoginService, VendorInfoService ];
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
                      MyHealthComponent,
                      LoginComponent,
                      SideBarComponent
];

@NgModule({
  declarations: [
    AnapneoComponent,
    COMPONENTS
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    AnapneoRoutingModule,
    ReactiveFormsModule
  ],
  exports:    [ AnapneoComponent, COMPONENTS ],
  providers:  [ SERVICES ],
})
export class AnapneoModule { }
