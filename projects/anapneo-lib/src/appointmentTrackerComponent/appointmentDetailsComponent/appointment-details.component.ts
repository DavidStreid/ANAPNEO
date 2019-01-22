import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'appointment-details',
  templateUrl: 'appointment-details.component.html',
  styleUrls: [ 'appointment-details.component.scss' ]
})

export class AppointmentDetailsComponent implements OnChanges {
  @Input()
  public appointment: object;

  public day: number;
  public month: number;

  public contact: string;
  public type: string;

  public checkInData: any = {};

  ngOnChanges() {
    const date = this.appointment['date'] || {};

    this.day = date['day'] || '';
    this.month = date['month'] || '';

    this.contact = this.appointment['contact'] || '';
    this.type = this.appointment['type'] || '';

    // Parse out checkInData if present
    const checkInData = this.appointment['checkInData'] || null;
    if( checkInData !== null && checkInData !== undefined){
      this.checkInData = this.parseCheckInData(checkInData);
    }
  }

  /**
   * Parses out each type of check In data into a readable form
   */
  parseCheckInData(checkInData: Object) {
    Object.keys(checkInData).forEach(function(key) {
      switch(key) {
        case 'Blood Pressure':
          checkInData[key] = `${checkInData[key]['systolic']}/${checkInData[key]['diastolic']}`;
          break;
        default:
          console.log(`${key}: Not a valid checkIn type`);
      }
    });
    return checkInData;
  }
}
