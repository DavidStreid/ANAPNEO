import { TestBed, async } from '@angular/core/testing';
import { AnapneoComponent } from './anapneo.component';

describe('AnapneoComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AnapneoComponent
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AnapneoComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'ThankYouForSmoking'`, () => {
    const fixture = TestBed.createComponent(AnapneoComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('ThankYouForSmoking');
  });

  it('TODO', () => {
    const fixture = TestBed.createComponent(AnapneoComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    // TODO - Add test on load
  });
});
