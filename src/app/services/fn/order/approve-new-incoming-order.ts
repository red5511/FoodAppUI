/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { ApproveNewIncomingOrderRequest } from '../../models/approve-new-incoming-order-request';

export interface ApproveNewIncomingOrder$Params {
      body: ApproveNewIncomingOrderRequest
}

export function approveNewIncomingOrder(http: HttpClient, rootUrl: string, params: ApproveNewIncomingOrder$Params, context?: HttpContext): Observable<StrictHttpResponse<string>> {
  const rb = new RequestBuilder(rootUrl, approveNewIncomingOrder.PATH, 'post');
  if (params) {
    rb.body(params.body, 'application/json');
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<string>;
    })
  );
}

approveNewIncomingOrder.PATH = '/api/v1/order/approve';
