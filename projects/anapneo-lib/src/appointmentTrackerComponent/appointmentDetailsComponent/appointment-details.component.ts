import { Component, Input, OnChanges } from '@angular/core';
import { trigger, state, style, animate, transition, } from '@angular/animations';
@Component({
  selector: 'appointment-details',
  templateUrl: 'appointment-details.component.html',
  styleUrls: [ 'appointment-details.component.scss' ],
  animations: [
    trigger('variableWidth', [
      state('20', style({
        width: '20%'
      })),
      state('30', style({
        width: '30%',
        left: '70%'
      })),
      // CHECK-IN (Show)
      transition('20 => 30', [
        animate('0.25s')
      ]),
      // CHECK-IN (Hide)
      transition('30 => 20', [
        animate('0.1s')
      ]),
    ]),
  ],
})

export class AppointmentDetailsComponent implements OnChanges {
  @Input()
  public appointment: object;

  // Trigger for check expand animation
  public checkExpand: boolean = false;

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

  /**
   * Triggered on user action to check-in
   */
  checkIn(){
    console.log('Checking in!');

    // TODO - Trigger form input to add data
  }

  public mouseEnter(divClass: String) {
    console.log(`Entering ${divClass}`);
    this.checkExpand = true;
  }
  public mouseLeave(divClass: String) {
    console.log(`Leaving ${divClass}`);
    this.checkExpand = false;
  }
}
