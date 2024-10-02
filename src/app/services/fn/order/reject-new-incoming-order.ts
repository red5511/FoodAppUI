/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { RejectNewIncomingOrderRequest } from '../../models/reject-new-incoming-order-request';

export interface RejectNewIncomingOrder$Params {
      body: RejectNewIncomingOrderRequest
}

export function rejectNewIncomingOrder(http: HttpClient, rootUrl: string, params: RejectNewIncomingOrder$Params, context?: HttpContext): Observable<StrictHttpResponse<string>> {
  const rb = new RequestBuilder(rootUrl, rejectNewIncomingOrder.PATH, 'post');
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

rejectNewIncomingOrder.PATH = '/api/v1/order/reject';
