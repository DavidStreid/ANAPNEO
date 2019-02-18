import { Component, Input } from '@angular/core';

@Component({
  selector: 'completed-checkIn',
  templateUrl: 'completed-checkIn.component.html',
  styleUrls: [ 'completed-checkIn.component.scss' ],
})

export class CompletedCheckInComponent {
  @Input()
  public type: String;
  @Input()
  public contact: String;
  @Input()
  public checkInData: Object[];
}
