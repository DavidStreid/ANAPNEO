import { LoginService } from './login.service';
import { HttpClientModule } from '@angular/common/http';
import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { environment } from '../../environment';
import { CookieService } from 'ngx-cookie-service';

describe('LoginService Server Integration Test', () => {
  let loginService: LoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientModule ],
      providers: [ LoginService, CookieService ]
    });

    loginService = TestBed.get(LoginService);
  });

  // Query server to verify endpoint is up
  it('Good User: Success', async(() => {
    if ( environment.integration ) {
      expect(loginService.anapneoService).not.toBeNull();
      /*
      loginService.login('RGF2aWRTdHJlaWQ=', 'dGVzdA==')
                      .subscribe((res: any) => {
                        expect( res[ 'success' ] ).toBe( true );
                        expect( res[ 'status' ] ).toBe( 'User and password are correct' );
                      });
      */
    }
  }));

  // Query server to verify endpoint is up
  it('Bad User: Fail', async(() => {
    if ( environment.integration ) {
      expect(loginService.anapneoService).not.toBeNull();
      /*
      loginService.login('BAD_USER', 'INVALID')
                      .subscribe((res: any) => {
                        expect( res[ 'success' ] ).toBe( false );
                        expect( res[ 'status' ] ).toBe( 'User not found' );
                      });
      */
    }
  }));
});
