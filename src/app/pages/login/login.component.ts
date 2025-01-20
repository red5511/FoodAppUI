import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/services';
import { AuthenticationRequest } from '../../services/models/authentication-request';
import { AuthenticationResponse } from '../../services/models/authentication-response';
import { TokenService } from '../../services/token/token.service';
import { LoginService } from '../../services/login/login.service';
import { ResendActivationEmail$Params } from '../../services/fn/authentication/resend-activation-email';
import { ToastrService } from 'ngx-toastr';

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
  isAccountNotActivated: boolean = false;
  alreadySend: boolean = false;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private tokenService: TokenService,
    private loginService: LoginService,
    private toastService: ToastrService
  ) {}

  onResendActivationEmail() {
    const params: ResendActivationEmail$Params = {
      email: this.authenticationRequest.email,
    };
    this.authService.resendActivationEmail(params).subscribe({
      next: () => {
        this.toastService.success(
          'Email z aktywacja konta został wysłany, sprawdź skrzynke'
        );
      },
    });
    this.alreadySend = true;
  }

  loginUser() {
    this.message = '';
    this.authService
      .authenticate({ body: this.authenticationRequest })
      .subscribe({
        next: (response) => {
          this.isAccountNotActivated = false;
          if (response) {
            this.isSuccess = true;
            this.authResponse = response;
            this.message = 'Sukces!';
            this.tokenService.token = response.token as string;
            setTimeout(() => {
              this.loginService.changeLoggedInStatus();
              this.router.navigate(['main']);
            }, 300);
          }
        },
        error: (err) => {
          this.message = 'Błąd logowania: ';
          if (err.error) {
            this.authenticationRequest.password = '';
            if (err.error.errorCode.includes('Konto nie zostało aktywowane')) {
              this.isAccountNotActivated = true;
            } else {
              this.isAccountNotActivated = false;
            }
            this.message =
              this.message + (err.error.errorCode || 'Nieznany bład');
          }
        },
      });
  }
}
