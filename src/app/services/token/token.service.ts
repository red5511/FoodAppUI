import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  removeToken() {
    localStorage.removeItem('token');
  }

  constructor() {}

  set token(token: string) {
    localStorage.setItem('token', token);
  }

  get token() {
    return localStorage.getItem('token') as string;
  }

  getEmail() {
    let token = localStorage.getItem('token') as string;
    if (token) {
      let decodedToken: any = jwtDecode(token);
      let email = decodedToken.sub;
      return email;
    }
    return null;
  }
}
