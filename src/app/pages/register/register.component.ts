import { Component } from '@angular/core';
import { AuthenticationService } from '../../services/services';
import { RegisterRequest } from '../../services/models/register-request';
import { AuthenticationResponse } from '../../services/models/authentication-response';
import { NgForm } from '@angular/forms';

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
    phoneNumber: ''
  };
  authResponse: AuthenticationResponse = {};
  message = '';
  isSuccess: boolean = false;
  confirmPassword: string = ''

  constructor(private authService: AuthenticationService) {
    console.log('ConfirmPassword initialized as:', this.confirmPassword);

  }

  registerUser(registerForm: NgForm) {
    if (registerForm.invalid) {
      return;
    }
    this.message = '';
    this.authService.register({ body: this.registerRequest }).subscribe({
      next: (response) => {
        this.isSuccess = true;
        if (response) {
          this.authResponse = response;
          this.message = 'Konto zostało utworzone';
        }
      },
      error: (err) => {
        this.message = 'Rejestracja nie powiodła się: ';
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
