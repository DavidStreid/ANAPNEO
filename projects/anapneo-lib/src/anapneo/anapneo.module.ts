import { CommonModule }           from '@angular/common';
import { NgModule }         from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AnapneoRoutingModule } from './Router/anapneo-routing.module';

// ROOT Component
import { AnapneoComponent } from './anapneo.component';

// CHILD Components
import { RewardsComponent }             from '../rewardsComponent/rewards.component';
import { VendorComponent }              from '../rewardsComponent/vendorComponent/vendor.component';
import { HeaderComponent }              from '../header/header.component';
import { RewardsInfoComponent }         from '../rewardsComponent/rewardsInfoComponent/rewards-info.component';
import { MyHealthComponent }            from '../myHealthComponent/myHealth.component';
import { AppointmentDetailsComponent }  from '../appointmentTrackerComponent/appointmentDetailsComponent/appointment-details.component';
import { CalendarDateComponent }        from '../appointmentTrackerComponent/calendarDateComponent/calendar-date.component';
import { CheckInsComponent }            from '../checkInsComponent/checkIns.component';
import { LoginComponent }               from '../loginComponent/login.component';
import { PageNotFoundComponent }        from '../pageNotFoundComponent/pageNotFound.component';
import { SideBarComponent }             from '../sidebar/sidebar.component';
import { CheckInsViewerComponent }      from '../checkInsComponent/check-ins-viewer/check-ins-viewer.component';
import { NgbdAlertSelfclosing }         from '../common-components/alertSelfClosingComponent/alert-selfclosing';

// Services
import { LocationService }    from '../services/location.service';
import { LoginService }       from '../services/login.service';
import { UserProfileService } from '../userProfile/userProfile.service';
import { VendorInfoService }  from '../rewardsComponent/vendorService/vendorInfoService';
import { CheckInsService }    from '../checkInsComponent/checkIns.service';
import { MyHealthService }    from '../myHealthComponent/myHealth.service';

const SERVICES    = [ LocationService, UserProfileService, LoginService, VendorInfoService, CheckInsService, MyHealthService ];
const COMPONENTS  = [
                      RewardsComponent,
                      RewardsInfoComponent,
                      VendorComponent,
                      HeaderComponent,
                      RewardsComponent,
                      PageNotFoundComponent,
                      AppointmentDetailsComponent,
                      CalendarDateComponent,
                      CheckInsComponent,
                      CheckInsViewerComponent,
                      MyHealthComponent,
                      LoginComponent,
                      SideBarComponent,
                      NgbdAlertSelfclosing
];

@NgModule({
  declarations: [
    AnapneoComponent,
    COMPONENTS
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    NgbAlertModule,
    BrowserModule,
    BrowserAnimationsModule,
    AnapneoRoutingModule,
    ReactiveFormsModule
  ],
  exports:    [ AnapneoComponent, COMPONENTS ],
  providers:  [ SERVICES ],
})
export class AnapneoModule { }
