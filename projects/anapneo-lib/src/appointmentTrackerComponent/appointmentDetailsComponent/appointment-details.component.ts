import { Component, Input, OnChanges }                  from '@angular/core';
import { FormGroup, FormControl }                       from '@angular/forms';
import { trigger, state, style, animate, transition, }  from '@angular/animations';

import { CheckInsService } from '../../checkInsComponent/checkIns.service';

@Component({
  selector: 'appointment-details',
  templateUrl: 'appointment-details.component.html',
  styleUrls: [ 'appointment-details.component.scss' ],
  animations: [
    trigger('variableHeight', [
      state('height-50', style({
        height: '50%'
      })),
      state('height-100', style({
        height: '100%'
      })),

      state('form-height', style({
        height: '200px'
      })),
      state('display-none', style({
        display: 'none',
      })),
      state('no-style', style({})),
      transition('* => form-height', [
        animate('0.1s')
      ]),
      transition('form-height => *', [
        animate('0.1s')
      ]),
    ]),
    trigger('variableWidth', [
      state('width-100', style({
        width: '100%',
        left: '0%',
        'border-left': 'none',
        'background-color': 'white'
      })),
      state('width-80', style({
        width: '80%',
        left: '0%',
        'border-left': 'none',
        'background-color': 'white'
      })),
      transition('* => width-100', [
        animate('0.25s')
      ]),
      transition('width-100 => *', [
        animate('0.1s')
      ]),
    ]),
  ],
})

export class AppointmentDetailsComponent implements OnChanges {
  @Input()
  public appointment: Object = {};
  @Input()
  public services: Object = {};
  @Input()
  public advocate: Object = {};

  public serviceTypes: string[] = [];
  public currType: string;

  // Trigger for check expand animation
  public showForm: boolean = true && this.appointment['checkedIn'];
  public promptSubmit: boolean = false;

  public date: object;
  public contact: string;
  public type: string;
  public checkInData: any = {};

  public savedFormData: Object = {};
  public checkInForm: FormGroup = new FormGroup({});

  constructor(private checkInsService: CheckInsService) {}

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
    // Parse out services
    this.serviceTypes = Object.keys(this.services);

    if( this.serviceTypes.length > 0 ){
      this.populateForm();
      this.showForm = true;
      this.promptSubmit = false;
    } else {
      this.promptSubmit = true;
    }
  }

  /**
   * Populates the form input with saved fields from services
   */
  private populateForm() {
    this.currType = this.serviceTypes.pop();
    const serviceFields: string[] = this.services[this.currType] || [];
    const formGroupObject: any = {};
    for( let field of serviceFields){
      formGroupObject[ field ] = new FormControl('');
    }
    this.checkInForm = new FormGroup(formGroupObject );
  }

  /**
   * Triggers the form closing
   */
  closeForm() {
    this.showForm = false;
    this.promptSubmit = false;
  }

  /**
   * Advances to next step in form and triggers submit option if end of form is reached
   */
  goForward() {
    this.saveFormData();
    // Advance service type to next type
    if( this.serviceTypes.length > 0 ){
      this.currType = this.serviceTypes.pop();
    } else {
      console.log( 'TIME TO SUBMIT' );
      this.currType = null;
      this.showForm = false;
      this.promptSubmit = true;
    }
  }

  /**
   * Parses out currently saved form data
   */
  saveFormData() {
    const serviceFields: string[] = this.services[this.currType] || [];
    this.savedFormData[ this.currType ] = {};
    for (var field of serviceFields) {
      this.savedFormData[ this.currType ][ field ] = this.checkInForm.value[ field ];
    }
  }

  /**
   * Formats form data for request
   */
  formatFormData() {
    const formatted = [];
    for (let type in this.savedFormData) {
      let data = this.savedFormData[ type ] || {};
      let entry = { type, data };
      formatted.push( entry );
    }

    return formatted;
  }

  /**
   * Parses saved form data and submits to checkIn service
   */
  submitForm() {
    const checkInData: Object = {
      contact: this.contact,
      type: this.type,
      date: this.date,
      checkedIn: true,
      checkInData: this.formatFormData()
    }
    const advocateName: string = this.advocate[ 'name' ];

    this.checkInsService.updateCheckIn(checkInData, advocateName).subscribe({
      next:     (res)     => {
        console.log( JSON.stringify(res) );
      },
      error:    (err)     => { console.error('SubmitCheckIn Error: ' + err);  },
      complete: ()        => { }
    });
  }
}
