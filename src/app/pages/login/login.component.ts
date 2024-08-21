import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/services';
import { AuthenticationRequest } from '../../services/models/authentication-request';
import { AuthenticationResponse } from '../../services/models/authentication-response';
import { TokenService } from '../../services/token/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  authenticationRequest: AuthenticationRequest = {
    email: '',
    password: ''
  };
  authResponse: AuthenticationResponse = {};
  message = '';
  isSuccess: boolean = false;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private tokenService: TokenService
  ) {
  }

  loginUser() {
    this.message = '';
    this.authService.authenticate({ body: this.authenticationRequest }).subscribe({
      next: (response) => {
        if (response) {
          this.isSuccess = true;
          this.authResponse = response;
          this.message = 'Account created successfully';
          this.tokenService.token = response.token as string;
          setTimeout(() => {
            this.router.navigate(['dashboard']);
          }, 300);
        }
      },
      error: (err) => {
        this.message = 'Login failed: ';
        if (err.error) {
          this.message = this.message + (err.error.errorCode || 'Unknown error');
        }
      }
    });
  }
}
