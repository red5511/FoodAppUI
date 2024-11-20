/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { addUserToCompany } from '../fn/administration/add-user-to-company';
import { AddUserToCompany$Params } from '../fn/administration/add-user-to-company';

@Injectable({ providedIn: 'root' })
export class AdministrationService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `addUserToCompany()` */
  static readonly AddUserToCompanyPath =
    '/api/v1/administration/company/{companyId}/user/{userId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `addUserToCompany()` instead.
   *
   * This method doesn't expect any request body.
   */
  addUserToCompany$Response(
    params: AddUserToCompany$Params,
    context?: HttpContext,
  ): Observable<StrictHttpResponse<void>> {
    return addUserToCompany(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `addUserToCompany$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  addUserToCompany(
    params: AddUserToCompany$Params,
    context?: HttpContext,
  ): Observable<void> {
    return this.addUserToCompany$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body),
    );
  }
}
