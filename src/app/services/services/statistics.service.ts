/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { getStatisticsConfig } from '../fn/statistics/get-statistics-config';
import { GetStatisticsConfig$Params } from '../fn/statistics/get-statistics-config';
import { GetStatisticsConfigResponse } from '../models/get-statistics-config-response';
import { getStatisticsOrderCount } from '../fn/statistics/get-statistics-order-count';
import { GetStatisticsOrderCount$Params } from '../fn/statistics/get-statistics-order-count';
import { GetStatisticsOrderCountResponse } from '../models/get-statistics-order-count-response';

@Injectable({ providedIn: 'root' })
export class StatisticsService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `getStatisticsOrderCount()` */
  static readonly GetStatisticsOrderCountPath = '/api/v1/statistics/order-count';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getStatisticsOrderCount()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  getStatisticsOrderCount$Response(params: GetStatisticsOrderCount$Params, context?: HttpContext): Observable<StrictHttpResponse<GetStatisticsOrderCountResponse>> {
    return getStatisticsOrderCount(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getStatisticsOrderCount$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  getStatisticsOrderCount(params: GetStatisticsOrderCount$Params, context?: HttpContext): Observable<GetStatisticsOrderCountResponse> {
    return this.getStatisticsOrderCount$Response(params, context).pipe(
      map((r: StrictHttpResponse<GetStatisticsOrderCountResponse>): GetStatisticsOrderCountResponse => r.body)
    );
  }

  /** Path part for operation `getStatisticsConfig()` */
  static readonly GetStatisticsConfigPath = '/api/v1/statistics/config';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getStatisticsConfig()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  getStatisticsConfig$Response(params: GetStatisticsConfig$Params, context?: HttpContext): Observable<StrictHttpResponse<GetStatisticsConfigResponse>> {
    return getStatisticsConfig(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getStatisticsConfig$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  getStatisticsConfig(params: GetStatisticsConfig$Params, context?: HttpContext): Observable<GetStatisticsConfigResponse> {
    return this.getStatisticsConfig$Response(params, context).pipe(
      map((r: StrictHttpResponse<GetStatisticsConfigResponse>): GetStatisticsConfigResponse => r.body)
    );
  }

}
