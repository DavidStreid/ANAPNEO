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
  public address: object;
  public place: object;
  public title: string;


  ngOnChanges() {
    this.day = this.appointment['date']['day'] || '';       // number
    this.month = this.appointment['date']['month'] || '';   // number
    this.title = this.appointment['title'] || '';
    this.place = this.appointment['place'] || '';
    this.address = this.appointment['address'] || {};
  }
}
