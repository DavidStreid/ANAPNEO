import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { AnapneoComponent } from './anapneo.component';
import { SideBarComponent } from '../sidebar/sidebar.component';
import { UserProfileService } from '../userProfile/userProfile.service';

// TODO - Replace with real router tests
import { RouterTestingModule } from '@angular/router/testing';

describe('AnapneoComponent', () => {
  let component: AnapneoComponent;
  let fixture: ComponentFixture<AnapneoComponent>;
  let userProfileServiceSpy: jasmine.SpyObj<UserProfileService>;

  beforeEach(async(() => {
    const spy = jasmine.createSpyObj('UserProfileService', ['getCoordinates']);

    TestBed.configureTestingModule({
      imports: [ RouterTestingModule ],
      declarations: [ AnapneoComponent, SideBarComponent ],
      providers: [ { provide: UserProfileService, useValue: spy } ]
    }).compileComponents();

    userProfileServiceSpy = TestBed.get(UserProfileService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnapneoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // TODO - Mock Router Links (https://angular.io/guide/testing#components-with-routerlink)
  it('has correct routing', () => {
    const compiled = fixture.debugElement.nativeElement;
    // TODO - Add test on load
  });
});
