import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl }                       from '@angular/forms';

import { CheckInsService } from '../../../checkInsComponent/check-ins-service/checkIns.service';

@Component({
  selector: 'pending-checkIn',
  templateUrl: 'pending-checkIn.component.html',
  styleUrls: [ 'pending-checkIn.component.scss' ],
})

export class PendingCheckInComponent {
  @Input()
  public services: Object = {};
  @Input()
  public type: String;
  @Input()
  public date: Object;
  @Input()
  public advocate: Object;
  @Input()
  public contact: String;
  @Input()
  public checkInData: any = {};
  @Output()
  public updateCheckIns: EventEmitter<any> = new EventEmitter();

  public serviceTypes: string[] = [];
  public currType: string;        // Controls display - if this is non-null, the form is being populated

  // Trigger for check expand animation
  public promptSubmit: boolean = false;     // Shows submission for form (options should still show)
  public workingForm: boolean = false;      // Shows options for form navigation

  public savedFormData: Object = {};
  public checkInForm: FormGroup = new FormGroup({});

  constructor(private checkInsService: CheckInsService) {}

  /**
   * Triggered on user action to check-in
   */
  initCheckIn(){
    // Parse out services
    this.serviceTypes = Object.keys(this.services);
    this.workingForm = true;

    if( this.serviceTypes.length > 0 ){
      this.populateForm();
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
    this.currType     = null;
    this.workingForm  = false;
    this.promptSubmit = false;
  }

  /**
   * Advances to next step in form and triggers submit option if end of form is reached
   */
  goForward() {
    this.saveFormData();
    // Advance service type to next type
    if( this.serviceTypes.length > 0 ){
      // Still types of data to enter, advance the current type
      this.currType = this.serviceTypes.pop();
    } else {
      // No more types of data to enter, null currType and prompt submission
      this.currType     = null;
      this.promptSubmit = true;
    }
  }

  /**
   * Parses out current form data and saves it to a global variable
   */
  saveFormData() {
    const serviceFields: string[]       = this.services[this.currType] || [];
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
      next:     (res)     => { this.updateCheckIns.emit(); },   // Emits event to update checkIns
      error:    (err)     => { console.error('SubmitCheckIn Error: ' + err);  },
      complete: ()        => { }
    });
  }
}
