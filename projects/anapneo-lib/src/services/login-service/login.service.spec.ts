import { LoginService } from './login.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Observable } from 'rxjs/Observable';
import { TestBed, ComponentFixture, async } from '@angular/core/testing';

describe('LoginService', () => {
  let loginService: LoginService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ LoginService ]
    });

    httpMock = TestBed.get(HttpTestingController);
    loginService = TestBed.get(LoginService);
  });

  afterEach(() => {
    httpMock.verify(); // verify there are no outstanding requests
  });

  it('login success response object', () => {
    const status: Object = {  success: true,
                              status: 'User and password are correct',
                              token: 'TEST' };

    loginService.login('', '')
                   .subscribe((res: any) => {
                      expect( res[ 'success' ] ).toBe( true );
                      expect( res[ 'status' ] ).toBe( 'User and password are correct' );
                      expect( res[ 'token' ] ).toBe( 'TEST' );
                   });

    const req = httpMock.expectOne(`${loginService.anapneoService}/login`);
    expect(req.request.method).toBe("POST");
    req.flush(status);
  });

  it('login fail response object', () => {
    const status: Object = { success: false, status: 'User not found' };

    loginService.login('', '')
                   .subscribe((res: any) => {
                      expect( res[ 'success' ] ).toBe( false );
                      expect( res[ 'status' ] ).toBe( 'User not found' );

                   });

    const req = httpMock.expectOne(`${loginService.anapneoService}/login`);
    expect(req.request.method).toBe("POST");
    req.flush(status);
  });

  it('Service fails without environment configuration', () => {
    // Reassign service url to simulate empty environment configuration
    loginService.anapneoService = null;

    loginService.login('', '')
                   .subscribe({
                      next:   (r) => fail('Should throw an error'),
                      error:  (e) => expect(e).toBe("Anapneo service url is not defined in config")
                   })
  });
});
