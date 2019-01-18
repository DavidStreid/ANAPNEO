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

  ngOnChanges() {
    const date = this.appointment['date'] || {};

    this.day = date['day'] || '';
    this.month = date['month'] || '';

    this.contact = this.appointment['contact'] || '';
    this.type = this.appointment['type'] || '';
  }
}
