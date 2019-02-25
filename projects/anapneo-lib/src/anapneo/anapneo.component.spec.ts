import { Component } from '@angular/core';
import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { AnapneoComponent } from './anapneo.component';
import { SideBarComponent } from '../sidebar/sidebar.component';
import { LoginComponent } from '../loginComponent/login.component';
import { RouterTestingModule } from '@angular/router/testing';  // TODO - Replace with real router tests
import { By } from '@angular/platform-browser';

// Mock LoginComponent
@Component({
  selector: 'user-login',
  template: ''
})
export class MockLoginComponent {}

describe('AnapneoComponent', () => {
  let component: AnapneoComponent;
  let fixture: ComponentFixture<AnapneoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule ],
      declarations: [ AnapneoComponent, SideBarComponent, MockLoginComponent ],
      providers: []
    }).compileComponents();
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

  it('should render userLogin by default', () => {
    expect(component.validLogin).toBe(false);   // Should be initialized to false until login event flips

    const loginComponent = fixture.debugElement.query(By.css('user-login'));
    expect(loginComponent).toBeTruthy();
  });

  it('should render userLogin by default', () => {
    // Should be initialized to false until login event flips
    expect(component.validLogin).toBe(false);

    const loginComponent = fixture.debugElement.query(By.css('user-login'));
    expect(loginComponent).toBeTruthy();
  });

  it('should render content if in validLogin state', () => {
    // Should be initialized to false until login event flips
    expect(component.validLogin).toBe(false);

    // Trigger Changes
    component.validLogin = true;
    fixture.detectChanges();

    const loginComponent = fixture.debugElement.query(By.css('user-login'));
    expect(loginComponent).toBeNull();

    const sideBarComponent = fixture.debugElement.query(By.css('sidebar'));
    expect(sideBarComponent).toBeTruthy();
  });
});
