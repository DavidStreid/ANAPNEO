import { CommonModule }             from '@angular/common';
import { NgModule }                 from '@angular/core';
import { HttpClientModule }         from '@angular/common/http';
import { ReactiveFormsModule }      from '@angular/forms';
import { NgbAlertModule }           from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule }            from '@angular/platform-browser';
import { BrowserAnimationsModule }  from '@angular/platform-browser/animations';
import { AnapneoRoutingModule }     from './Router/anapneo-routing.module';
import { MatDatepickerModule }      from '@angular/material/datepicker';
import { MatInputModule, MatNativeDateModule, MatFormFieldModule }      from '@angular/material';
import { CookieService }            from 'ngx-cookie-service';
import { HTTP_INTERCEPTORS }        from '@angular/common/http';
import { TokenInterceptor }         from '../utils/token.interceptor';

// ROOT Component
import { AnapneoComponent } from './anapneo.component';

// CHILD Components
import { HeaderComponent }              from '../header/header.component';
import { MyHealthComponent }            from '../myHealthComponent/myHealth.component';
import { AppointmentDetailsComponent }  from '../appointmentTrackerComponent/appointmentDetailsComponent/appointment-details.component';
import { CompletedCheckInComponent }    from '../appointmentTrackerComponent/appointmentDetailsComponent/completedCheckInComponent/completed-checkIn.component';
import { PendingCheckInComponent }      from '../appointmentTrackerComponent/appointmentDetailsComponent/pending-check-in-component/pending-check-in.component';
import { EntryFormComponent }           from '../appointmentTrackerComponent/appointmentDetailsComponent/entryFormComponent/entry-form.component';
import { CalendarDateComponent }        from '../appointmentTrackerComponent/calendarDateComponent/calendar-date.component';
import { CheckInsComponent }            from '../checkInsComponent/checkIns.component';
import { LoginComponent }               from '../loginComponent/login.component';
import { PageNotFoundComponent }        from '../pageNotFoundComponent/pageNotFound.component';
import { SideBarComponent }             from '../sidebar/sidebar.component';
import { CheckInsViewerComponent }      from '../checkInsComponent/check-ins-viewer/check-ins-viewer.component';
import { NgbdAlertSelfClosingComponent }         from '../common-components/alertSelfClosingComponent/alert-selfclosing';

// Services
import { LocationService }    from '../services/location.service';
import { LoginService }       from '../services/login-service/login.service';
import { UserProfileService } from '../userProfile/userProfile.service';
import { CheckInsService }    from '../checkInsComponent/check-ins-service/checkIns.service';
import { MyHealthService }    from '../myHealthComponent/myHealth.service';

const SERVICES    = [ CookieService,
                      LocationService,
                      UserProfileService,
                      LoginService,
                      CheckInsService,
                      MyHealthService ];
const COMPONENTS  = [
                      HeaderComponent,
                      PageNotFoundComponent,
                      AppointmentDetailsComponent,
                      CompletedCheckInComponent,
                      PendingCheckInComponent,
                      CalendarDateComponent,
                      CheckInsComponent,
                      EntryFormComponent,
                      CheckInsViewerComponent,
                      MyHealthComponent,
                      LoginComponent,
                      SideBarComponent,
                      NgbdAlertSelfClosingComponent
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
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    AnapneoRoutingModule
  ],
  exports:    [ AnapneoComponent, COMPONENTS ],
  providers:  [ SERVICES,
                MatDatepickerModule,
                {
                  provide: HTTP_INTERCEPTORS,
                  useClass: TokenInterceptor,
                  multi: true
                }
              ],
})
export class AnapneoModule { }
