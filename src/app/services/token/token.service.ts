import { Injectable } from '@angular/core';
import { jwtDecode } from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  removeToken() {
    localStorage.removeItem('token');
  }

  constructor() { }

  set token(token: string){
    localStorage.setItem('token', token);
  }

  get token(){
    return localStorage.getItem('token') as string;
  }
  getEmail() {
    let token = localStorage.getItem('token') as string;
    if (token) {
      let decodedToken: any = jwtDecode(token); // Decode the JWT
      let email = decodedToken.sub; // Assuming the email is stored in the 'email' field
      return email;
    }
    return null;
  }
}
