import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { noneAuthPathsWhenJwtPresentGuard } from './none-auth-paths-when-jwt-present.guard';

describe('noneAuthPathsWhenJwtPresentGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() =>
      noneAuthPathsWhenJwtPresentGuard(...guardParameters),
    );

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
