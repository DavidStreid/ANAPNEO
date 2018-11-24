import { Component, Input } from '@angular/core';

@Component({
  selector: 'appointment-details',
  templateUrl: 'appointment-details.component.html',
  styleUrls: [ 'appointment-details.component.scss' ]
})

export class AppointmentDetailsComponent {
  @Input()
  public day: number;
  @Input()
  public month: number;
  @Input()
  public address: object;
}
