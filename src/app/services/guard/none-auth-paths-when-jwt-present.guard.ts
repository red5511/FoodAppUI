import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../token/token.service';
import { inject } from '@angular/core';

export const noneAuthPathsWhenJwtPresentGuard: CanActivateFn = (
  route,
  state,
) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);
  if (!!tokenService.token) {
    router.navigate(['dashboard2']);
    return false;
  }
  return true;
};
