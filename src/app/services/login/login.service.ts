import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TokenService } from '../token/token.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedInVisibility$ = this.isLoggedInSubject.asObservable();

  constructor(private tokenService: TokenService) {
    const token = this.tokenService.token;
    const isLoggedIn = !!token;
    this.isLoggedInSubject.next(isLoggedIn);
  }
  changeLoggedInStatus() {
    this.isLoggedInSubject.next(!this.isLoggedInSubject.value);
  }
}
