import { Component } from '@angular/core';
import { AuthenticationResponse } from '../../models/authentication-response';
import { RegisterRequest } from '../../models/register-request';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerRequest: RegisterRequest = {};
  authResponse: AuthenticationResponse = {};
  message = '';

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {
  }
  
  registerUser() {
    this.message = '';
    this.authService.register(this.registerRequest).subscribe({
      next: (response) => {
        if (response) {
          this.authResponse = response;
        } else {
          this.message = 'Account created successfully';
          // setTimeout(() => {
          //   this.router.navigate(['login']);
          // }, 3000);
        }
      },
      error: (err) => {
        if (err.error && err.error.errorCode === 'User already exists') {
          this.message = 'Registration failed: Email is already in use.';
        } else {
          this.message = 'Registration failed: ' + (err.error.message || 'Unknown error');
        }
      }
    });
  }
}