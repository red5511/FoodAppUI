import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../token/token.service';
import { inject } from '@angular/core';

export const noneAuthPathsWhenJwtPresentGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router)
  console.log('noneAuth');
  console.log(tokenService.token);
  console.log(!tokenService.token);
  console.log(!!tokenService.token);
  console.log(!!!tokenService.token);
//   null
// none-auth-paths-when-jwt-present.guard.ts:9 true
// none-auth-paths-when-jwt-present.guard.ts:10 false
// none-auth-paths-when-jwt-present.guard.ts:11 true
  if (!!tokenService.token) {
    console.log('noneAuth XDDDd');
    router.navigate(['dashboard2']);
    return false;
  }
  return true;
};
