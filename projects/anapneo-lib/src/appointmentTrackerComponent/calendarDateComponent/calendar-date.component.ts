import { Component, Input } from '@angular/core';
import DateUtil from '../../utils/date.util';

@Component({
  selector: 'calendar-date',
  templateUrl: 'calendar-date.component.html',
  styleUrls: [ 'calendar-date.component.scss' ]
})

export class CalendarDateComponent{
  @Input()
  month: number;
  @Input()
  day: number;

  private dateUtil;

  constructor() {
    this.dateUtil = new DateUtil();
  }

  public displayMonth(month: number): string {
    return this.dateUtil.getMonthString( month );
  }
}
