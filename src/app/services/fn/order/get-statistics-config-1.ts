/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { GetOrdersConfigRequest } from '../../models/get-orders-config-request';
import { GetOrdersConfigResponse } from '../../models/get-orders-config-response';

export interface GetStatisticsConfig1$Params {
      body: GetOrdersConfigRequest
}

export function getStatisticsConfig1(http: HttpClient, rootUrl: string, params: GetStatisticsConfig1$Params, context?: HttpContext): Observable<StrictHttpResponse<GetOrdersConfigResponse>> {
  const rb = new RequestBuilder(rootUrl, getStatisticsConfig1.PATH, 'post');
  if (params) {
    rb.body(params.body, 'application/json');
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<GetOrdersConfigResponse>;
    })
  );
}

getStatisticsConfig1.PATH = '/api/v1/order/config';
