import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckInsViewerComponent } from './check-ins-viewer.component';

describe('CheckInsViewerComponent', () => {
  let component: CheckInsViewerComponent;
  let fixture: ComponentFixture<CheckInsViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckInsViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckInsViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
