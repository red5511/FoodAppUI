import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TokenService } from '../token/token.service';
import { LoginService } from '../login/login.service';
import { ToastrService } from 'ngx-toastr';
import { SocketService } from '../websocket/socket-service';

@Injectable()
export class AuthLogoutInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private tokenService: TokenService,
    private loginService: LoginService,
    private toastService: ToastrService,
    private webSocketService: SocketService,
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        this.toastService.error('Akcja nie została wykonana poprawnie', 'Błąd');
        if (error.status === 401) {
          // Token is invalid or expired
          this.webSocketService.processDisconnection()
          this.tokenService.removeToken();
          this.loginService.changeLoggedInStatus();
          this.router.navigate(['/login']);
        }
        return throwError(error);
      }),
    );
  }
}
