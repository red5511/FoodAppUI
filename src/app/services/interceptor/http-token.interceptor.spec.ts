import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn } from '@angular/common/http';
import { HttpTokenInterceptor } from './http-token.interceptor'; // Correct import

describe('HttpTokenInterceptor', () => {  // Correct class name here
  let interceptor: HttpTokenInterceptor;  // Use the class instead of function

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HttpTokenInterceptor]  // Provide the interceptor in the test bed
    });

    interceptor = TestBed.inject(HttpTokenInterceptor);  // Inject the interceptor
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();  // Check if the interceptor is created
  });
});
