/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { deleteCompany } from '../fn/company/delete-company';
import { DeleteCompany$Params } from '../fn/company/delete-company';
import { modifyCompany } from '../fn/company/modify-company';
import { ModifyCompany$Params } from '../fn/company/modify-company';
import { saveCompany } from '../fn/company/save-company';
import { SaveCompany$Params } from '../fn/company/save-company';

@Injectable({ providedIn: 'root' })
export class CompanyService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `modifyCompany()` */
  static readonly ModifyCompanyPath = '/api/v1/company/modify';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `modifyCompany()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  modifyCompany$Response(params: ModifyCompany$Params, context?: HttpContext): Observable<StrictHttpResponse<string>> {
    return modifyCompany(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `modifyCompany$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  modifyCompany(params: ModifyCompany$Params, context?: HttpContext): Observable<string> {
    return this.modifyCompany$Response(params, context).pipe(
      map((r: StrictHttpResponse<string>): string => r.body)
    );
  }

  /** Path part for operation `saveCompany()` */
  static readonly SaveCompanyPath = '/api/v1/company/save';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `saveCompany()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  saveCompany$Response(params: SaveCompany$Params, context?: HttpContext): Observable<StrictHttpResponse<string>> {
    return saveCompany(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `saveCompany$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  saveCompany(params: SaveCompany$Params, context?: HttpContext): Observable<string> {
    return this.saveCompany$Response(params, context).pipe(
      map((r: StrictHttpResponse<string>): string => r.body)
    );
  }

  /** Path part for operation `deleteCompany()` */
  static readonly DeleteCompanyPath = '/api/v1/company/delete';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `deleteCompany()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  deleteCompany$Response(params: DeleteCompany$Params, context?: HttpContext): Observable<StrictHttpResponse<string>> {
    return deleteCompany(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `deleteCompany$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  deleteCompany(params: DeleteCompany$Params, context?: HttpContext): Observable<string> {
    return this.deleteCompany$Response(params, context).pipe(
      map((r: StrictHttpResponse<string>): string => r.body)
    );
  }

}
