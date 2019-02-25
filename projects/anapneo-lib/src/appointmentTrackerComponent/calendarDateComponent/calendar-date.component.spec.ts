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

  it( 'should have a date and month div on init', () => {
    const calendarDayDiv = fixture.debugElement.query(By.css('.calendar-day'));
    expect( calendarDayDiv ).toBeTruthy();

    const calendarMonthDiv = fixture.debugElement.query(By.css('.calendar-month'));
    expect( calendarMonthDiv ).toBeTruthy();
  });

  it('displayMonth should return the right string', () => {
    const months = {
      'Jan': 1,
      'Feb': 2,
      'Mar': 3,
      'Apr': 4,
      'May': 5,
      'Jun': 6,
      'Jul': 7,
      'Aug': 8,
      'Sep': 9,
      'Oct': 10,
      'Nov': 11,
      'Dec': 12
    };

    Object.keys(months).forEach( (m: string) => {
      expect( component.displayMonth(months[m]) ).toBe(m);
    });
  });
});
