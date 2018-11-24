import { Component, Input, OnChanges } from '@angular/core';


@Component({
  selector: 'calendar-date',
  templateUrl: 'calendar-date.component.html',
  styleUrls: [ 'calendar-date.component.scss' ]
})

export class CalendarDateComponent implements OnChanges  {
  @Input()
  month: number;
  @Input()
  day: number;

  ngOnChanges(){
    console.log(this.month);
    console.log(this.day);
  }
}
