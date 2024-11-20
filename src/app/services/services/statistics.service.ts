/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { getStatisticsChart } from '../fn/statistics/get-statistics-chart';
import { GetStatisticsChart$Params } from '../fn/statistics/get-statistics-chart';
import { GetStatisticsChartResponse } from '../models/get-statistics-chart-response';
import { getStatisticsConfig } from '../fn/statistics/get-statistics-config';
import { GetStatisticsConfig$Params } from '../fn/statistics/get-statistics-config';
import { GetStatisticsConfigResponse } from '../models/get-statistics-config-response';

@Injectable({ providedIn: 'root' })
export class StatisticsService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `getStatisticsConfig()` */
  static readonly GetStatisticsConfigPath = '/api/v1/statistics/config';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getStatisticsConfig()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  getStatisticsConfig$Response(
    params: GetStatisticsConfig$Params,
    context?: HttpContext,
  ): Observable<StrictHttpResponse<GetStatisticsConfigResponse>> {
    return getStatisticsConfig(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getStatisticsConfig$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  getStatisticsConfig(
    params: GetStatisticsConfig$Params,
    context?: HttpContext,
  ): Observable<GetStatisticsConfigResponse> {
    return this.getStatisticsConfig$Response(params, context).pipe(
      map(
        (
          r: StrictHttpResponse<GetStatisticsConfigResponse>,
        ): GetStatisticsConfigResponse => r.body,
      ),
    );
  }

  /** Path part for operation `getStatisticsChart()` */
  static readonly GetStatisticsChartPath = '/api/v1/statistics/chart';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getStatisticsChart()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  getStatisticsChart$Response(
    params: GetStatisticsChart$Params,
    context?: HttpContext,
  ): Observable<StrictHttpResponse<GetStatisticsChartResponse>> {
    return getStatisticsChart(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getStatisticsChart$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  getStatisticsChart(
    params: GetStatisticsChart$Params,
    context?: HttpContext,
  ): Observable<GetStatisticsChartResponse> {
    return this.getStatisticsChart$Response(params, context).pipe(
      map(
        (
          r: StrictHttpResponse<GetStatisticsChartResponse>,
        ): GetStatisticsChartResponse => r.body,
      ),
    );
  }
}
