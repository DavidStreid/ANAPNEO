import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'appointment-details',
  templateUrl: 'appointment-details.component.html',
  styleUrls: [ 'appointment-details.component.scss' ]
})

export class AppointmentDetailsComponent implements OnChanges {
  @Input()
  public appointment: object;

  public date: object;

  public contact: string;
  public type: string;

  public checkInData: any = {};

  ngOnChanges() {
    this.date = this.appointment['date'] || {};
    this.contact = this.appointment['contact'] || '';
    this.type = this.appointment['type'] || '';

    // Parse out checkInData if present
    const checkInData = this.appointment['checkInData'] || null;
    if( checkInData !== null && checkInData !== undefined){
      this.assignCheckInData(checkInData);
    }
  }

  /**
   * Parses out each type of check In data into a readable form
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
}
