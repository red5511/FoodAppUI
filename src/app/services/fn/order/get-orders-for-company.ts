/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { GetOrdersForCompanyRequest } from '../../models/get-orders-for-company-request';
import { PagedOrdersResponse } from '../../models/paged-orders-response';

export interface GetOrdersForCompany$Params {
  body: GetOrdersForCompanyRequest;
}

export function getOrdersForCompany(
  http: HttpClient,
  rootUrl: string,
  params: GetOrdersForCompany$Params,
  context?: HttpContext,
): Observable<StrictHttpResponse<PagedOrdersResponse>> {
  const rb = new RequestBuilder(rootUrl, getOrdersForCompany.PATH, 'post');
  if (params) {
    rb.body(params.body, 'application/json');
  }

  return http
    .request(
      rb.build({ responseType: 'json', accept: 'application/json', context }),
    )
    .pipe(
      filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<PagedOrdersResponse>;
      }),
    );
}

getOrdersForCompany.PATH = '/api/v1/order/orders';
