import { Component }              from '@angular/core';
import { CalendarDateComponent }  from './calendar-date.component';
import { By }                     from '@angular/platform-browser';

describe('CalendarDate Component', () => {
  let component: CalendarDateComponent;

  beforeEach(() => {
    component = new CalendarDateComponent();
  });

  it('displayMonth should return the right string', () => {
    const months = {
      1: 'Jan',
      2: 'Feb',
      3: 'Mar',
      4: 'Apr',
      5: 'May',
      6: 'Jun',
      7: 'Jul',
      8: 'Aug',
      9: 'Sep',
      10: 'Oct',
      11: 'Nov',
      12: 'Dec'
    }

    Object.keys(months).forEach( (m) => {
      expect( component.displayMonth(m) ).toBe(months[m] );
    })
  })
});
