/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { GetStatisticsConfigRequest } from '../../models/get-statistics-config-request';
import { GetStatisticsConfigResponse } from '../../models/get-statistics-config-response';

export interface GetStatisticsConfig$Params {
      body: GetStatisticsConfigRequest
}

export function getStatisticsConfig(http: HttpClient, rootUrl: string, params: GetStatisticsConfig$Params, context?: HttpContext): Observable<StrictHttpResponse<GetStatisticsConfigResponse>> {
  const rb = new RequestBuilder(rootUrl, getStatisticsConfig.PATH, 'post');
  if (params) {
    rb.body(params.body, 'application/json');
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<GetStatisticsConfigResponse>;
    })
  );
}

getStatisticsConfig.PATH = '/api/v1/statistics/config';
