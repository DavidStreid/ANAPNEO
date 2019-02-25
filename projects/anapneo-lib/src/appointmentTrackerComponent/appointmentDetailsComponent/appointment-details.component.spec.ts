import {  Component,
          Input,
          EventEmitter,
          Output,
          DebugElement }                      from '@angular/core';
import {  TestBed, ComponentFixture, async }  from '@angular/core/testing';
import {  AppointmentDetailsComponent }       from './appointment-details.component';
import {  ReactiveFormsModule }               from '@angular/forms';
import {  MatDatepickerModule }               from '@angular/material/datepicker';
import {  MatInputModule,
          MatNativeDateModule,
          MatFormFieldModule }                from '@angular/material';
import { NoopAnimationsModule }               from '@angular/platform-browser/animations';
import { By }                                 from '@angular/platform-browser';
import { CheckInsService }                    from '../../checkInsComponent/check-ins-service/checkIns.service';
import { Observable }                         from 'rxjs/Observable';
import { Appointment }                        from '../models/appointment';

describe('AppointmentDetails', () => {
  let element: Object;
  let debugElementParent: DebugElement;
  let componentParent: AppointmentDetailsComponentHost;

  let fixture: ComponentFixture<AppointmentDetailsComponentHost>;
  let checkInsService: CheckInsService;
  let spy: any;

  beforeEach(async(() => {
    checkInsService = new CheckInsService(null, null);
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
                    {provide: CheckInsService, useValue: checkInsService},
                  ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppointmentDetailsComponentHost);
    element = fixture.nativeElement;

    debugElementParent = fixture.debugElement;
    componentParent = fixture.componentInstance;
  }));

  it('initialization: No DOM element until input of an appointment', () => {
    const apptDetailsDOM = fixture.debugElement.query(By.css('.appt-details-comp'));
    expect( apptDetailsDOM ).toBeFalsy();
  });

  it('Entry state triggered and shown on input of entry appointment', () => {
    // Create new entry appointment and trigger ngOnChanges
    componentParent.appointment = new Appointment();
    fixture.detectChanges();

    // Check that AppointmentDetails state is 'entry'
    const debugElementChild = fixture.debugElement.query(By.directive(AppointmentDetailsComponent));
    const component = debugElementChild.componentInstance;
    expect( component[ 'state' ] ).toBe('entry');

    // Verify view
    const entryFormDOM = fixture.debugElement.query(By.css('entry-form'));
    const entryDateDOM = fixture.debugElement.query(By.css('mat-form-field'));
    const completedCheckInDOM = fixture.debugElement.query(By.css('completed-checkIn'));
    const pendingCheckInDOM = fixture.debugElement.query(By.css('pending-checkIn'));
    const calendarDateDOM = fixture.debugElement.query(By.css('calendar-date'));

    const visible = [ entryFormDOM, entryDateDOM ];
    const notVisible = [ completedCheckInDOM, pendingCheckInDOM, calendarDateDOM ];
    visible.forEach( (dom) => {
      expect( dom ).toBeTruthy(); });
    notVisible.forEach( (dom) => {
      expect( dom ).toBeFalsy(); });
  });

  it('Completed state triggered and shown on input of completed   appointment', () => {
    // Create new entry appointment and trigger ngOnChanges
    const appt = new Appointment();
    appt.setDate( 1,1,1 );          // Null date determines 'entry' state
    appt.setCheckedIn( false );     // False CheckedIn status determines 'pending' state
    appt.setCheckInData( [
      {
        type: 'Blood Pressure',
        data: {
          systolic: '115',
          diastolic: '75'
        }
      },
      {
        type: 'invalid',
        data: null
      }
    ]);
    componentParent.appointment = appt;
    fixture.detectChanges();

    // Check that AppointmentDetails state is 'pending'
    const debugElementChild = fixture.debugElement.query(By.directive(AppointmentDetailsComponent));
    const component = debugElementChild.componentInstance;
    expect( component[ 'state' ] ).toBe('pending');

    // Verify view
    const entryFormDOM = fixture.debugElement.query(By.css('entry-form'));
    const entryDateDOM = fixture.debugElement.query(By.css('mat-form-field'));
    const completedCheckInDOM = fixture.debugElement.query(By.css('completed-checkIn'));
    const pendingCheckInDOM = fixture.debugElement.query(By.css('pending-checkIn'));
    const calendarDateDOM = fixture.debugElement.query(By.css('calendar-date'));

    const visible = [ pendingCheckInDOM, calendarDateDOM ];
    const notVisible = [ entryFormDOM, entryDateDOM, completedCheckInDOM ];
    visible.forEach( (dom) => {
      expect( dom ).toBeTruthy(); });
    notVisible.forEach( (dom) => {
      expect( dom ).toBeFalsy(); });

    // Check that checkIn data was successfully parsed
    const checkInData = component.checkInData || {};
    expect( checkInData[ 'Blood Pressure' ] ).toBeTruthy();
    expect( checkInData[ 'Blood Pressure' ] ).toBe('115/75');
  });

  it('Completed state triggered and shown on input of completed appointment', () => {
    // Create new entry appointment and trigger ngOnChanges
    const appt = new Appointment();
    appt.setDate( 1,1,1 );
    appt.setCheckedIn( true );        // CheckedIn status puts in completed state

    componentParent.appointment = appt;
    fixture.detectChanges();

    // Check that AppointmentDetails state is 'completed'
    const debugElementChild = fixture.debugElement.query(By.directive(AppointmentDetailsComponent));
    const component = debugElementChild.componentInstance;
    expect( component[ 'state' ] ).toBe('completed');

    // Verify view
    const entryFormDOM = fixture.debugElement.query(By.css('entry-form'));
    const entryDateDOM = fixture.debugElement.query(By.css('mat-form-field'));
    const completedCheckInDOM = fixture.debugElement.query(By.css('completed-checkIn'));
    const pendingCheckInDOM = fixture.debugElement.query(By.css('pending-checkIn'));
    const calendarDateDOM = fixture.debugElement.query(By.css('calendar-date'));

    const visible = [ calendarDateDOM, completedCheckInDOM  ];
    const notVisible = [ entryFormDOM, pendingCheckInDOM, entryDateDOM ];
    visible.forEach( (dom) => {
      expect( dom ).toBeTruthy(); });
    notVisible.forEach( (dom) => {
      expect( dom ).toBeFalsy(); });
  });

  it('EntryForm update triggers performUpdate to emit event to parent with correct payload', () => {
    spy = spyOn(checkInsService, 'createPendingCheckIn').and.returnValue(new Observable());
    let mockUpdate: Object = { advocate: 'TEST_ADVOCATE', type: 'TEST_TYPE' };

    // Pass in entry appointment - will be passed to the entry-form child
    componentParent.appointment = new Appointment();
    componentParent.advocate = {};
    fixture.detectChanges();

    // Verify components are present
    const entryFormDOM = fixture.debugElement.query(By.css('entry-form'));
    const entryDateDOM = fixture.debugElement.query(By.css('mat-form-field'));
    const apptDetDom = fixture.debugElement.query(By.directive(AppointmentDetailsComponent));
    expect( entryFormDOM ).toBeTruthy();
    expect( entryDateDOM ).toBeTruthy();
    expect( apptDetDom ).toBeTruthy();

    // Grab component references
    const entryFormComponent = entryFormDOM.componentInstance;
    const component = apptDetDom.componentInstance;

    // Emit mock entry update, without date being set - shouldn't call service
    entryFormComponent.update.emit( mockUpdate )
    expect(spy).not.toHaveBeenCalled();

    // Set date and repeat - should call service
    let apptDate = component.checkInForm.controls['apptDate'];
    apptDate.setValue("TEST_DATE");
    fixture.detectChanges();

    entryFormComponent.update.emit( mockUpdate )

    expect(spy).toHaveBeenCalled(); // With date set, a create call should be made
  });
});

@Component({
  template: '<appointment-details [appointment]="appointment" [services]="services" [advocate]="advocate"></appointment-details>'
})
class AppointmentDetailsComponentHost{
  appointment: Object;
  services: Object;
  advocate: Object;
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
  @Output() update: EventEmitter<any> = new EventEmitter();
}
@Component({
  selector: 'calendar-date',
  template: ''
})
class MockCalendarDate{
  @Input() day;
  @Input() month;
}

