import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/services';
import { RegisterRequest } from '../../services/models/register-request';
import { AuthenticationResponse } from '../../services/models/authentication-response';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerRequest: RegisterRequest = {
    email: '',
    firstName: '',
    lastName: '',
    password: ''
  };
  authResponse: AuthenticationResponse = {};
  message = '';
  isSuccess: boolean = false;

  constructor(
    private authService: AuthenticationService,
  ) {
  }

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
        // if (err.error instanceof Blob) {
        //   // Convert Blob to JSON
        //   const reader = new FileReader();
        //   reader.onload = () => {
        //     try {
        //       const errorText = reader.result as string;
        //       const errorJson = JSON.parse(errorText);
        //       console.error('Parsed error JSON:', errorJson); // Log the parsed JSON for debugging

        //       // Extract errorCode
        //       const errorCode = errorJson.errorCode; 
        //       console.log('Extracted errorCode:', errorCode); // Log the extracted errorCode for debugging

        //       // Provide specific user-friendly messages based on error code
        //       switch (errorCode) {
        //         case 'User already exists':
        //           this.message += 'User already exists. Please use a different email address.';
        //           break;
        //         // Add more cases for different error codes if necessary
        //         default:
        //           this.message += errorCode || 'Unknown error';
        //       }
        //     } catch (e) {
        //       console.error('Failed to parse error Blob as JSON:', e);
        //       this.message += 'Unknown error occurred';
        //     }
        //   };
        //   reader.readAsText(err.error);
        // } else {
        //   this.message += 'Unknown error occurred';
        // }




        console.log(err);
        this.message = 'Registration failed: ';
        if (err.error) {
          console.error('Error details:', err.error); // Log the error details
          // Check if errorCode exists in the error object
          const errorCode = err.error.errorCode || err.error['errorCode'];
          console.log('Extracted errorCode:', errorCode); // Log the extracted errorCode for debugging  
          this.message = this.message + (err.error.errorCode || 'Unknown error');
        }
      }
    });
  }
}