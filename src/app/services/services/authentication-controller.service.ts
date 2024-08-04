/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { activateUser } from '../fn/authentication-controller/activate-user';
import { ActivateUser$Params } from '../fn/authentication-controller/activate-user';
import { authenticate } from '../fn/authentication-controller/authenticate';
import { Authenticate$Params } from '../fn/authentication-controller/authenticate';
import { AuthenticationResponse } from '../models/authentication-response';
import { ChangeInitPasswordResponse } from '../models/change-init-password-response';
import { changePassword } from '../fn/authentication-controller/change-password';
import { ChangePassword$Params } from '../fn/authentication-controller/change-password';
import { changePassword1 } from '../fn/authentication-controller/change-password-1';
import { ChangePassword1$Params } from '../fn/authentication-controller/change-password-1';
import { initPasswordChange } from '../fn/authentication-controller/init-password-change';
import { InitPasswordChange$Params } from '../fn/authentication-controller/init-password-change';
import { register } from '../fn/authentication-controller/register';
import { Register$Params } from '../fn/authentication-controller/register';

@Injectable({ providedIn: 'root' })
export class AuthenticationControllerService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `changePassword()` */
  static readonly ChangePasswordPath = '/api/v1/auth/password/change/confirm';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `changePassword()` instead.
   *
   * This method doesn't expect any request body.
   */
  changePassword$Response(params: ChangePassword$Params, context?: HttpContext): Observable<StrictHttpResponse<string>> {
    return changePassword(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `changePassword$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  changePassword(params: ChangePassword$Params, context?: HttpContext): Observable<string> {
    return this.changePassword$Response(params, context).pipe(
      map((r: StrictHttpResponse<string>): string => r.body)
    );
  }

  /** Path part for operation `register()` */
  static readonly RegisterPath = '/api/v1/auth/register/init';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `register()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  register$Response(params: Register$Params, context?: HttpContext): Observable<StrictHttpResponse<AuthenticationResponse>> {
    return register(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `register$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  register(params: Register$Params, context?: HttpContext): Observable<AuthenticationResponse> {
    return this.register$Response(params, context).pipe(
      map((r: StrictHttpResponse<AuthenticationResponse>): AuthenticationResponse => r.body)
    );
  }

  /** Path part for operation `initPasswordChange()` */
  static readonly InitPasswordChangePath = '/api/v1/auth/password/change/init';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `initPasswordChange()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  initPasswordChange$Response(params: InitPasswordChange$Params, context?: HttpContext): Observable<StrictHttpResponse<ChangeInitPasswordResponse>> {
    return initPasswordChange(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `initPasswordChange$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  initPasswordChange(params: InitPasswordChange$Params, context?: HttpContext): Observable<ChangeInitPasswordResponse> {
    return this.initPasswordChange$Response(params, context).pipe(
      map((r: StrictHttpResponse<ChangeInitPasswordResponse>): ChangeInitPasswordResponse => r.body)
    );
  }

  /** Path part for operation `authenticate()` */
  static readonly AuthenticatePath = '/api/v1/auth/authenticate';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `authenticate()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  authenticate$Response(params: Authenticate$Params, context?: HttpContext): Observable<StrictHttpResponse<AuthenticationResponse>> {
    return authenticate(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `authenticate$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  authenticate(params: Authenticate$Params, context?: HttpContext): Observable<AuthenticationResponse> {
    return this.authenticate$Response(params, context).pipe(
      map((r: StrictHttpResponse<AuthenticationResponse>): AuthenticationResponse => r.body)
    );
  }

  /** Path part for operation `activateUser()` */
  static readonly ActivateUserPath = '/api/v1/auth/register/confirm/{token}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `activateUser()` instead.
   *
   * This method doesn't expect any request body.
   */
  activateUser$Response(params: ActivateUser$Params, context?: HttpContext): Observable<StrictHttpResponse<string>> {
    return activateUser(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `activateUser$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  activateUser(params: ActivateUser$Params, context?: HttpContext): Observable<string> {
    return this.activateUser$Response(params, context).pipe(
      map((r: StrictHttpResponse<string>): string => r.body)
    );
  }

  /** Path part for operation `changePassword1()` */
  static readonly ChangePassword1Path = '/api/v1/auth/password/change/confirm/{token}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `changePassword1()` instead.
   *
   * This method doesn't expect any request body.
   */
  changePassword1$Response(params: ChangePassword1$Params, context?: HttpContext): Observable<StrictHttpResponse<string>> {
    return changePassword1(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `changePassword1$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  changePassword1(params: ChangePassword1$Params, context?: HttpContext): Observable<string> {
    return this.changePassword1$Response(params, context).pipe(
      map((r: StrictHttpResponse<string>): string => r.body)
    );
  }

}
