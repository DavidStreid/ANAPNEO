import { Component, Input, Output, EventEmitter, OnChanges }  from '@angular/core';
import { FormGroup, FormControl }                             from '@angular/forms';

import { Appointment }                                        from '../models/appointment';
import { CheckInsService } from '../../checkInsComponent/checkIns.service';

@Component({
  selector: 'appointment-details',
  templateUrl: 'appointment-details.component.html',
  styleUrls: [ 'appointment-details.component.scss' ]
})

export class AppointmentDetailsComponent implements OnChanges {
  @Input()
  public appointment: Appointment;
  @Input()
  public services: Object = {};
  @Input()
  public advocate: Object = {};
  @Output()
  public update: EventEmitter<any> = new EventEmitter();
  @Output()
  public remove: EventEmitter<any> = new EventEmitter();

  public checkInForm: FormGroup = new FormGroup({
    apptDate: new FormControl('')
  });

  public state: String;                 // This determines the state of the form - entry, pending, complete
  public savedFormData: Object = {};    // Saves form data entered

  public serviceTypes: string[] = [];
  public currType: string;

  public date: object;
  public contact: string;
  public type: string;
  public checkInData: any = {};

  constructor(private checkInsService: CheckInsService) {}

  // Returns whether date object is entered and needs to be filled in
  isDateEmpty( date ){
    if( date[ 'day' ] && date['month'] && date['year'] ){
      return false;
    }
    return true;
  }

  /**
   * Executes dynamic parsing of inputs to generate the state of the appointment and generate checkInData if completed
   */
  ngOnChanges() {
    this.date       = this.appointment.date       || {};
    this.contact    = this.appointment.contact    || '';
    this.type       = this.appointment.type       || '';
    const checkedIn = this.appointment.checkedIn  || false;

    // Check the appointment to see what state it is in
    // TODO - Make state part of the appointment class
    if( this.isDateEmpty(this.date) ){
      this.state = 'entry';
    } else if( ! checkedIn ) {
      this.state = 'pending';
    } else {
      this.state = 'completed';
    }

    // Parse out checkInData if present
    const checkInData = this.appointment.checkInData || null;
    if( checkInData !== null && checkInData !== undefined){
      this.assignCheckInData(checkInData);
    }
  }

  /**
   * Takes data entered from the entry form and attempts to create a pending check-in. All portions of
   * the entry form and the date object must be populated in order to submit
   */
  performUpdate(update: Object){
    const contact = update[ 'advocate' ];
    const type = update[ 'type' ];
    const date = this.checkInForm.value[ 'apptDate' ] || '';
    const advocateName: string = this.advocate[ 'name' ];

    if( contact && contact !== '' &&
        type && contact != '' &&
        date && date != ''){
      const pendingCheckIn: Object = { contact, type, date };
      this.checkInsService.createPendingCheckIn(pendingCheckIn, advocateName).subscribe({
        next:     (res)     => { this.updateCheckIns(); },     // Update the list of checkIns
        error:    (err)     => { console.error('SubmitCheckIn Error: ' + err);  },
        complete: ()        => { }
      });
    }
  }

  /**
   * Parses out each type of check In data into a readable form
   *    TYPES:
   *        BloodPressure - Creates systolic & diastolic entries
   */
  assignCheckInData(checkInData: Object[]) {
    for (const checkIn of checkInData) {
      const type = checkIn[ 'type' ];
      const data = checkIn[ 'data' ] || {};

      switch(type) {
        case 'Blood Pressure':
          this.checkInData[type] = `${data['systolic']}/${data['diastolic']}`;
          break;
        default:
          console.log(`${type}: Not a valid checkIn type`);
      }
    }
  }

  /**
   * Emits event to parent component that the current appointment should be removed from the checkIn object
   */
  public removeAppointment(event) {
    this.remove.emit();
  }

  /**
   * Populates the form input with saved fields from services
   */
  public updateCheckIns() {
    this.update.emit(); // Emits an event to update the checkins
  }

  public parseDay(date: Object) {
    if( date ){
      return date[ 'day' ];
    }
    return null;
  }
  public parseMonth(date: Object) {
    if( date ){
      return date[ 'month' ];
    }
    return null;
  }
}
