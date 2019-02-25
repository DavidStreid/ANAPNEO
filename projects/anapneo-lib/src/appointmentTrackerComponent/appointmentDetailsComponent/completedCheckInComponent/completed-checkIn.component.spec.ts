import { Component }              from '@angular/core';
import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { CompletedCheckInComponent }  from './completed-checkIn.component';
import { By }                     from '@angular/platform-browser';

describe('CompletedCheckIn Component', () => {
  let component: CompletedCheckInComponent;
  let fixture: ComponentFixture<CompletedCheckInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [  ],
      declarations: [ CompletedCheckInComponent ],
      providers: []
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompletedCheckInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('CheckIn Type should be right-aligned', () => {
    const rightAlignComponent = fixture.debugElement.query(By.css('.text-right'));
    expect(rightAlignComponent).toBeTruthy();
    // TODO - Add check on value of DOM element to be type
  });
});
