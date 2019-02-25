import {  Component, Input, DebugElement }    from '@angular/core';
import {  TestBed, ComponentFixture, async }  from '@angular/core/testing';
import {  AppointmentDetailsComponent }       from './appointment-details.component';
import {  ReactiveFormsModule }               from '@angular/forms';
import {  MatDatepickerModule }               from '@angular/material/datepicker';
import {  MatInputModule,
          MatNativeDateModule,
          MatFormFieldModule }                from '@angular/material';
import { NoopAnimationsModule }               from '@angular/platform-browser/animations';
import { By }                                 from '@angular/platform-browser';
import { CheckInsService }                    from '../../checkInsComponent/checkIns.service';

describe('AppointmentDetails', () => {
  // let component: AppointmentDetailsComponent;
  let element; Object;
  let de: DebugElement;
  let componentHost: AppointmentDetailsComponentHost;
  let fixture: ComponentFixture<AppointmentDetailsComponentHost>;
  let service: CheckInsService;
  let spy: any;

  beforeEach(async(() => {
    service = new CheckInsService(null, null);
    TestBed.configureTestingModule({
      imports:  [
                  ReactiveFormsModule,
                  MatDatepickerModule,
                  MatFormFieldModule,
                  MatNativeDateModule,
                  MatInputModule,
                  NoopAnimationsModule
                ],
      declarations: [
                        AppointmentDetailsComponent,
                        AppointmentDetailsComponentHost,
                        MockCompletedCheckIn,
                        MockPendingCheckIn,
                        MockEntryForm,
                        MockCalendarDate
                    ],
      providers:  [
                    {provide: CheckInsService, useValue: service},
                  ]
    }).compileComponents();
    fixture = TestBed.createComponent(AppointmentDetailsComponentHost);
    componentHost = fixture.componentInstance;
    element = fixture.nativeElement;
    de = fixture.debugElement;
    fixture.detectChanges();
  }));

  it('tests ngOnChanges', () => {
  });

  it('REFERENCE: anything that uses checkinsservice', () => {
    spy = spyOn(service, 'createPendingCheckIn').and.returnValue(false);
  });
});

@Component({
  template: '<appointment-details [appointment]="appointment" [services]="services" [advocate]="advocate"></appointment-details>'
})
class AppointmentDetailsComponentHost{
  appointment: Object = {};
  services: Object = {};
  advocate: Object = {};
}

@Component({
  selector: 'pending-checkIn',
  template: ''
})
class MockPendingCheckIn{
  @Input() type;
  @Input() contact;
  @Input() date;
  @Input() checkInData;
  @Input() services;
  @Input() advocate;
}
@Component({
  selector: 'completed-checkIn',
  template: ''
})
class MockCompletedCheckIn{
  @Input() type;
  @Input() contact;
  @Input() checkInData;
}
@Component({
  selector: 'entry-form',
  template: ''
})
class MockEntryForm{
}
@Component({
  selector: 'calendar-date',
  template: ''
})
class MockCalendarDate{
  @Input() day;
  @Input() month;
}
