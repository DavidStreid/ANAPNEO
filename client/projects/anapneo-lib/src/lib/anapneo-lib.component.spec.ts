import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnapneoLibComponent } from './anapneo-lib.component';

describe('AnapneoLibComponent', () => {
  let component: AnapneoLibComponent;
  let fixture: ComponentFixture<AnapneoLibComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnapneoLibComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnapneoLibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
