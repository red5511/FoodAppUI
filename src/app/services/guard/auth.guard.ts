import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../token/token.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router)
  console.log('authGuard')
  console.log(tokenService.token);
  console.log(!tokenService.token);
  console.log(!!tokenService.token);
  console.log(!!!tokenService.token);
  if(!tokenService.token){
    router.navigate(['login']);
    console.log("auth xdddddd")
    return false;
  }
  return true;
};
