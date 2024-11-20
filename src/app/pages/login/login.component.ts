import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/services';
import { AuthenticationRequest } from '../../services/models/authentication-request';
import { AuthenticationResponse } from '../../services/models/authentication-response';
import { TokenService } from '../../services/token/token.service';
import { LoginService } from '../../services/login/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  authenticationRequest: AuthenticationRequest = {
    email: '',
    password: '',
  };
  authResponse: AuthenticationResponse = {};
  message = '';
  isSuccess: boolean = false;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private tokenService: TokenService,
    private loginService: LoginService,
  ) {}

  loginUser() {
    this.message = '';
    this.authService
      .authenticate({ body: this.authenticationRequest })
      .subscribe({
        next: (response) => {
          if (response) {
            this.isSuccess = true;
            this.authResponse = response;
            this.message = 'Account created successfully';
            this.tokenService.token = response.token as string;
            this.loginService.loggedIn();
            setTimeout(() => {
              this.router.navigate(['dashboard2']);
            }, 300);
          }
        },
        error: (err) => {
          this.message = 'Login failed: ';
          if (err.error) {
            this.message =
              this.message + (err.error.errorCode || 'Unknown error');
          }
        },
      });
  }
}
