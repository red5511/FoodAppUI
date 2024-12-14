/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { DashboardGetOrdersResponse } from '../../models/dashboard-get-orders-response';
import { GetActiveOrdersRequest } from '../../models/get-active-orders-request';

export interface GetActiveOrders$Params {
  companyId: number;
      body: GetActiveOrdersRequest
}

export function getActiveOrders(http: HttpClient, rootUrl: string, params: GetActiveOrders$Params, context?: HttpContext): Observable<StrictHttpResponse<DashboardGetOrdersResponse>> {
  const rb = new RequestBuilder(rootUrl, getActiveOrders.PATH, 'post');
  if (params) {
    rb.path('companyId', params.companyId, {});
    rb.body(params.body, 'application/json');
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<DashboardGetOrdersResponse>;
    })
  );
}

getActiveOrders.PATH = '/api/v1/dashboard/orders/{companyId}';
