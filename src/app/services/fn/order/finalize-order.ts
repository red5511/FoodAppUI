/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { FinalizeOrderRequest } from '../../models/finalize-order-request';

export interface FinalizeOrder$Params {
  companyId: number;
  orderId: number;
      body: FinalizeOrderRequest
}

export function finalizeOrder(http: HttpClient, rootUrl: string, params: FinalizeOrder$Params, context?: HttpContext): Observable<StrictHttpResponse<void>> {
  const rb = new RequestBuilder(rootUrl, finalizeOrder.PATH, 'post');
  if (params) {
    rb.path('companyId', params.companyId, {});
    rb.path('orderId', params.orderId, {});
    rb.body(params.body, 'application/json');
  }

  return http.request(
    rb.build({ responseType: 'text', accept: '*/*', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
    })
  );
}

finalizeOrder.PATH = '/api/v1/order/finalize/{companyId}/{orderId}';
