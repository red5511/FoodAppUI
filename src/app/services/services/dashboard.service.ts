/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { DashboardGetCompanyResponse } from '../models/dashboard-get-company-response';
import { DashboardGetInitConfigResponse } from '../models/dashboard-get-init-config-response';
import { DashboardGetOrdersResponse } from '../models/dashboard-get-orders-response';
import { getActiveOrders } from '../fn/dashboard/get-active-orders';
import { GetActiveOrders$Params } from '../fn/dashboard/get-active-orders';
import { getCompany } from '../fn/dashboard/get-company';
import { GetCompany$Params } from '../fn/dashboard/get-company';
import { getConfig } from '../fn/dashboard/get-config';
import { GetConfig$Params } from '../fn/dashboard/get-config';

@Injectable({ providedIn: 'root' })
export class DashboardService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `getActiveOrders()` */
  static readonly GetActiveOrdersPath = '/api/v1/dashboard/orders/{companyId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getActiveOrders()` instead.
   *
   * This method doesn't expect any request body.
   */
  getActiveOrders$Response(
    params: GetActiveOrders$Params,
    context?: HttpContext,
  ): Observable<StrictHttpResponse<DashboardGetOrdersResponse>> {
    return getActiveOrders(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getActiveOrders$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getActiveOrders(
    params: GetActiveOrders$Params,
    context?: HttpContext,
  ): Observable<DashboardGetOrdersResponse> {
    return this.getActiveOrders$Response(params, context).pipe(
      map(
        (
          r: StrictHttpResponse<DashboardGetOrdersResponse>,
        ): DashboardGetOrdersResponse => r.body,
      ),
    );
  }

  /** Path part for operation `getConfig()` */
  static readonly GetConfigPath = '/api/v1/dashboard/config/';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getConfig()` instead.
   *
   * This method doesn't expect any request body.
   */
  getConfig$Response(
    params?: GetConfig$Params,
    context?: HttpContext,
  ): Observable<StrictHttpResponse<DashboardGetInitConfigResponse>> {
    return getConfig(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getConfig$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getConfig(
    params?: GetConfig$Params,
    context?: HttpContext,
  ): Observable<DashboardGetInitConfigResponse> {
    return this.getConfig$Response(params, context).pipe(
      map(
        (
          r: StrictHttpResponse<DashboardGetInitConfigResponse>,
        ): DashboardGetInitConfigResponse => r.body,
      ),
    );
  }

  /** Path part for operation `getCompany()` */
  static readonly GetCompanyPath = '/api/v1/dashboard/company/{companyId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getCompany()` instead.
   *
   * This method doesn't expect any request body.
   */
  getCompany$Response(
    params: GetCompany$Params,
    context?: HttpContext,
  ): Observable<StrictHttpResponse<DashboardGetCompanyResponse>> {
    return getCompany(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getCompany$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getCompany(
    params: GetCompany$Params,
    context?: HttpContext,
  ): Observable<DashboardGetCompanyResponse> {
    return this.getCompany$Response(params, context).pipe(
      map(
        (
          r: StrictHttpResponse<DashboardGetCompanyResponse>,
        ): DashboardGetCompanyResponse => r.body,
      ),
    );
  }
}
