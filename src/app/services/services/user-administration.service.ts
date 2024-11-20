/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { getAllUsers } from '../fn/user-administration/get-all-users';
import { GetAllUsers$Params } from '../fn/user-administration/get-all-users';
import { getCompanyUsers } from '../fn/user-administration/get-company-users';
import { GetCompanyUsers$Params } from '../fn/user-administration/get-company-users';
import { getUsersNotBelongToCompany } from '../fn/user-administration/get-users-not-belong-to-company';
import { GetUsersNotBelongToCompany$Params } from '../fn/user-administration/get-users-not-belong-to-company';
import { GetUsersResponse } from '../models/get-users-response';

@Injectable({ providedIn: 'root' })
export class UserAdministrationService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `getCompanyUsers()` */
  static readonly GetCompanyUsersPath =
    '/api/v1/administration/user/{companyId}/users';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getCompanyUsers()` instead.
   *
   * This method doesn't expect any request body.
   */
  getCompanyUsers$Response(
    params: GetCompanyUsers$Params,
    context?: HttpContext,
  ): Observable<StrictHttpResponse<GetUsersResponse>> {
    return getCompanyUsers(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getCompanyUsers$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getCompanyUsers(
    params: GetCompanyUsers$Params,
    context?: HttpContext,
  ): Observable<GetUsersResponse> {
    return this.getCompanyUsers$Response(params, context).pipe(
      map(
        (r: StrictHttpResponse<GetUsersResponse>): GetUsersResponse => r.body,
      ),
    );
  }

  /** Path part for operation `getUsersNotBelongToCompany()` */
  static readonly GetUsersNotBelongToCompanyPath =
    '/api/v1/administration/user/{companyId}/users-to-add';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getUsersNotBelongToCompany()` instead.
   *
   * This method doesn't expect any request body.
   */
  getUsersNotBelongToCompany$Response(
    params: GetUsersNotBelongToCompany$Params,
    context?: HttpContext,
  ): Observable<StrictHttpResponse<GetUsersResponse>> {
    return getUsersNotBelongToCompany(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getUsersNotBelongToCompany$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getUsersNotBelongToCompany(
    params: GetUsersNotBelongToCompany$Params,
    context?: HttpContext,
  ): Observable<GetUsersResponse> {
    return this.getUsersNotBelongToCompany$Response(params, context).pipe(
      map(
        (r: StrictHttpResponse<GetUsersResponse>): GetUsersResponse => r.body,
      ),
    );
  }

  /** Path part for operation `getAllUsers()` */
  static readonly GetAllUsersPath = '/api/v1/administration/user/users';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getAllUsers()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAllUsers$Response(
    params?: GetAllUsers$Params,
    context?: HttpContext,
  ): Observable<StrictHttpResponse<GetUsersResponse>> {
    return getAllUsers(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getAllUsers$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAllUsers(
    params?: GetAllUsers$Params,
    context?: HttpContext,
  ): Observable<GetUsersResponse> {
    return this.getAllUsers$Response(params, context).pipe(
      map(
        (r: StrictHttpResponse<GetUsersResponse>): GetUsersResponse => r.body,
      ),
    );
  }
}
