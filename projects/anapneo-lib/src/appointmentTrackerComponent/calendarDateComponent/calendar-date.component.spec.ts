import { Component }              from '@angular/core';
import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { CalendarDateComponent }  from './calendar-date.component';
import { By }                     from '@angular/platform-browser';

describe('CalendarDate Component', () => {
  let component: CalendarDateComponent;
  let fixture: ComponentFixture<CalendarDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [  ],
      declarations: [ CalendarDateComponent ],
      providers: []
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    component = new CalendarDateComponent();
  });

  it( 'should have a date and month div on init', () => {
    const calendarDayDiv = fixture.debugElement.query(By.css('.calendar-day'));
    expect( calendarDayDiv ).toBeTruthy();

    const calendarMonthDiv = fixture.debugElement.query(By.css('.calendar-month'));
    expect( calendarMonthDiv ).toBeTruthy();
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
