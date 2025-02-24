/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { CreateOrderRequest } from '../../models/create-order-request';
import { CreateOrderRequestResponse } from '../../models/create-order-request-response';

export interface SaveOrder$Params {
  companyId: number;
      body: CreateOrderRequest
}

export function saveOrder(http: HttpClient, rootUrl: string, params: SaveOrder$Params, context?: HttpContext): Observable<StrictHttpResponse<CreateOrderRequestResponse>> {
  const rb = new RequestBuilder(rootUrl, saveOrder.PATH, 'post');
  if (params) {
    rb.path('companyId', params.companyId, {});
    rb.body(params.body, 'application/json');
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<CreateOrderRequestResponse>;
    })
  );
}

saveOrder.PATH = '/api/v1/order/save/{companyId}';
