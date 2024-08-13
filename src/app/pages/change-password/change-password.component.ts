import { Component } from '@angular/core';
import { AuthenticationService } from '../../services/services';
import { ChangeInitPasswordRequest, ChangeInitPasswordResponse } from '../../services/models';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent {
  request: ChangeInitPasswordRequest = {};
  response: ChangeInitPasswordResponse = {};
  message = '';
  isSuccess: boolean = false;

  constructor(
    private authService: AuthenticationService,
  ) {
  }

  changePassword() {
    this.authService.initPasswordChange({ body: this.request }).subscribe({
      next: (response) => {
        if (response) {
          this.response = response;
          this.isSuccess = true;
          this.message = 'Email was send with reset password link';
        }
      },
      error: (err) => {
        this.message = 'Change password failed: ';
        if (err.error) {
          this.message = this.message + (err.error.errorCode || 'Unknown error');
        }
      }
    });
  }
}
