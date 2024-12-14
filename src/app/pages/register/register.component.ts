import { Component } from '@angular/core';
import { AuthenticationService } from '../../services/services';
import { RegisterRequest } from '../../services/models/register-request';
import { AuthenticationResponse } from '../../services/models/authentication-response';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  registerRequest: RegisterRequest = {
    email: '',
    firstName: '',
    lastName: '',
    password: '',
  };
  authResponse: AuthenticationResponse = {};
  message = '';
  isSuccess: boolean = false;

  constructor(private authService: AuthenticationService) {}

  registerUser() {
    this.message = '';
    this.authService.register({ body: this.registerRequest }).subscribe({
      next: (response) => {
        this.isSuccess = true;
        if (response) {
          this.authResponse = response;
          this.message = 'Account created successfully';
        }
      },
      error: (err) => {
        this.message = 'Registration failed: ';
        if (err.error) {
          console.error('Error details:', err.error); // Log the error details
          // Check if errorCode exists in the error object
          const errorCode = err.error.errorCode || err.error['errorCode'];
          this.message =
            this.message + (err.error.errorCode || 'Unknown error');
        }
      },
    });
  }
}
