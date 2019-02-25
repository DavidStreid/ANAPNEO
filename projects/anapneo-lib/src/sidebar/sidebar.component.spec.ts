import { Component } from '@angular/core';
import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { SideBarComponent } from './sidebar.component';
import { By } from '@angular/platform-browser';

import { RouterTestingModule } from '@angular/router/testing';

describe('SidebarComponent', () => {
  let component: SideBarComponent;
  let fixture: ComponentFixture<SideBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule ],
      declarations: [ SideBarComponent ],
      providers: []
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Nav Tabs should be present: MyHealth & CheckIns', () => {
    const allTabs = fixture.debugElement.queryAll(By.css('.nav-select'));
    expect( allTabs.length ).toBe(2);

    const myHealthTab = fixture.debugElement.query(By.css('#my-health-tab'));
    expect( myHealthTab ).toBeTruthy();

    const CheckInsTab = fixture.debugElement.query(By.css('#check-ins-nav'));
    expect( CheckInsTab ).toBeTruthy();
  } );

  it('Description should match & be visible', () => {
    expect( component.descriptionTest ).toBe('HealthAdv connects community leaders to members who may benefit from a check-in');
    const appDescription = fixture.debugElement.query(By.css('#app-description'));
    expect( appDescription ).toBeTruthy();
  });
});
