import { Component, Input, OnChanges } from '@angular/core';
import DateUtil from '../../utils/date.util';

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

  private dateUtil;

  constructor() {
    this.dateUtil = new DateUtil();
  }

  displayMonth(month: number): string {
    return this.dateUtil.getMonthString( month );
  }

  ngOnChanges(){
    console.log(this.month);
    console.log(this.day);
  }
}
