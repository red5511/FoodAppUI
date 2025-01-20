/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { addOrRemoveCompaniesUsers } from '../fn/user-administration/add-or-remove-companies-users';
import { AddOrRemoveCompaniesUsers$Params } from '../fn/user-administration/add-or-remove-companies-users';
import { addOrRemoveUsersPermissions } from '../fn/user-administration/add-or-remove-users-permissions';
import { AddOrRemoveUsersPermissions$Params } from '../fn/user-administration/add-or-remove-users-permissions';
import { getAllPermissions } from '../fn/user-administration/get-all-permissions';
import { GetAllPermissions$Params } from '../fn/user-administration/get-all-permissions';
import { GetAllPermissionsResponse } from '../models/get-all-permissions-response';
import { getAllUsers } from '../fn/user-administration/get-all-users';
import { GetAllUsers$Params } from '../fn/user-administration/get-all-users';
import { getCompanyUsers } from '../fn/user-administration/get-company-users';
import { GetCompanyUsers$Params } from '../fn/user-administration/get-company-users';
import { getPagedUsers } from '../fn/user-administration/get-paged-users';
import { GetPagedUsers$Params } from '../fn/user-administration/get-paged-users';
import { GetPagedUsersResponse } from '../models/get-paged-users-response';
import { getUsersNotBelongToCompany } from '../fn/user-administration/get-users-not-belong-to-company';
import { GetUsersNotBelongToCompany$Params } from '../fn/user-administration/get-users-not-belong-to-company';
import { GetUsersResponse } from '../models/get-users-response';

@Injectable({ providedIn: 'root' })
export class UserAdministrationService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `getPagedUsers()` */
  static readonly GetPagedUsersPath = '/api/v1/admin-panel/users/pages';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getPagedUsers()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  getPagedUsers$Response(params: GetPagedUsers$Params, context?: HttpContext): Observable<StrictHttpResponse<GetPagedUsersResponse>> {
    return getPagedUsers(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getPagedUsers$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  getPagedUsers(params: GetPagedUsers$Params, context?: HttpContext): Observable<GetPagedUsersResponse> {
    return this.getPagedUsers$Response(params, context).pipe(
      map((r: StrictHttpResponse<GetPagedUsersResponse>): GetPagedUsersResponse => r.body)
    );
  }

  /** Path part for operation `addOrRemoveUsersPermissions()` */
  static readonly AddOrRemoveUsersPermissionsPath = '/api/v1/admin-panel/users/add-or-remove-users-permissions';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `addOrRemoveUsersPermissions()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  addOrRemoveUsersPermissions$Response(params: AddOrRemoveUsersPermissions$Params, context?: HttpContext): Observable<StrictHttpResponse<void>> {
    return addOrRemoveUsersPermissions(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `addOrRemoveUsersPermissions$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  addOrRemoveUsersPermissions(params: AddOrRemoveUsersPermissions$Params, context?: HttpContext): Observable<void> {
    return this.addOrRemoveUsersPermissions$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

  /** Path part for operation `addOrRemoveCompaniesUsers()` */
  static readonly AddOrRemoveCompaniesUsersPath = '/api/v1/admin-panel/users/add-or-remove-companies-users';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `addOrRemoveCompaniesUsers()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  addOrRemoveCompaniesUsers$Response(params: AddOrRemoveCompaniesUsers$Params, context?: HttpContext): Observable<StrictHttpResponse<void>> {
    return addOrRemoveCompaniesUsers(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `addOrRemoveCompaniesUsers$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  addOrRemoveCompaniesUsers(params: AddOrRemoveCompaniesUsers$Params, context?: HttpContext): Observable<void> {
    return this.addOrRemoveCompaniesUsers$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

  /** Path part for operation `getCompanyUsers()` */
  static readonly GetCompanyUsersPath = '/api/v1/admin-panel/users/{companyId}/users';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getCompanyUsers()` instead.
   *
   * This method doesn't expect any request body.
   */
  getCompanyUsers$Response(params: GetCompanyUsers$Params, context?: HttpContext): Observable<StrictHttpResponse<GetUsersResponse>> {
    return getCompanyUsers(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getCompanyUsers$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getCompanyUsers(params: GetCompanyUsers$Params, context?: HttpContext): Observable<GetUsersResponse> {
    return this.getCompanyUsers$Response(params, context).pipe(
      map((r: StrictHttpResponse<GetUsersResponse>): GetUsersResponse => r.body)
    );
  }

  /** Path part for operation `getUsersNotBelongToCompany()` */
  static readonly GetUsersNotBelongToCompanyPath = '/api/v1/admin-panel/users/{companyId}/users-to-add';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getUsersNotBelongToCompany()` instead.
   *
   * This method doesn't expect any request body.
   */
  getUsersNotBelongToCompany$Response(params: GetUsersNotBelongToCompany$Params, context?: HttpContext): Observable<StrictHttpResponse<GetUsersResponse>> {
    return getUsersNotBelongToCompany(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getUsersNotBelongToCompany$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getUsersNotBelongToCompany(params: GetUsersNotBelongToCompany$Params, context?: HttpContext): Observable<GetUsersResponse> {
    return this.getUsersNotBelongToCompany$Response(params, context).pipe(
      map((r: StrictHttpResponse<GetUsersResponse>): GetUsersResponse => r.body)
    );
  }

  /** Path part for operation `getAllUsers()` */
  static readonly GetAllUsersPath = '/api/v1/admin-panel/users/users';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getAllUsers()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAllUsers$Response(params?: GetAllUsers$Params, context?: HttpContext): Observable<StrictHttpResponse<GetUsersResponse>> {
    return getAllUsers(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getAllUsers$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAllUsers(params?: GetAllUsers$Params, context?: HttpContext): Observable<GetUsersResponse> {
    return this.getAllUsers$Response(params, context).pipe(
      map((r: StrictHttpResponse<GetUsersResponse>): GetUsersResponse => r.body)
    );
  }

  /** Path part for operation `getAllPermissions()` */
  static readonly GetAllPermissionsPath = '/api/v1/admin-panel/users/permissions';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getAllPermissions()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAllPermissions$Response(params?: GetAllPermissions$Params, context?: HttpContext): Observable<StrictHttpResponse<GetAllPermissionsResponse>> {
    return getAllPermissions(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getAllPermissions$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAllPermissions(params?: GetAllPermissions$Params, context?: HttpContext): Observable<GetAllPermissionsResponse> {
    return this.getAllPermissions$Response(params, context).pipe(
      map((r: StrictHttpResponse<GetAllPermissionsResponse>): GetAllPermissionsResponse => r.body)
    );
  }

}
