import { LoginService } from './login.service';
import { HttpClientModule } from '@angular/common/http';
import { TestBed, ComponentFixture, async } from '@angular/core/testing';

describe('LoginService Integration Test', () => {
  let loginService: LoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientModule ],
      providers: [ LoginService ]
    });

    loginService = TestBed.get(LoginService);
  });

  it('Good User: Success', () => {
    expect(loginService.anapneoService).not.toBeNull();
    loginService.login('RGF2aWRTdHJlaWQ=', 'dGVzdA==')
                    .subscribe((res: any) => {
                      expect( res[ 'success' ] ).toBe( true );
                      expect( res[ 'status' ] ).toBe( 'User and password are correct' );
                      expect( res[ 'token' ] ).not.toBeNull();
                    });
  });

  it('Bad User: Fail', () => {
    expect(loginService.anapneoService).not.toBeNull();
    loginService.login('BAD_USER', 'INVALID')
                    .subscribe((res: any) => {
                      expect( res[ 'success' ] ).toBe( false );
                      expect( res[ 'status' ] ).toBe( 'User not found' );
                    });

  });
});
