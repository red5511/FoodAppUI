/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { GetStatisticsOrderCountRequest } from '../../models/get-statistics-order-count-request';
import { GetStatisticsOrderCountResponse } from '../../models/get-statistics-order-count-response';

export interface GetStatisticsOrderCount$Params {
      body: GetStatisticsOrderCountRequest
}

export function getStatisticsOrderCount(http: HttpClient, rootUrl: string, params: GetStatisticsOrderCount$Params, context?: HttpContext): Observable<StrictHttpResponse<GetStatisticsOrderCountResponse>> {
  const rb = new RequestBuilder(rootUrl, getStatisticsOrderCount.PATH, 'post');
  if (params) {
    rb.body(params.body, 'application/json');
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<GetStatisticsOrderCountResponse>;
    })
  );
}

getStatisticsOrderCount.PATH = '/api/v1/statistics/order-count';
