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
    this.day = this.appointment['date']['day'];
    this.month = this.appointment['date']['month'];
    this.title = this.appointment['date']['title'];
    this.place = this.appointment['date']['place'];
  }
}
