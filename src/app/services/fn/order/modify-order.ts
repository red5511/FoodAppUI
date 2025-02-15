/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { ModifyOrderRequest } from '../../models/modify-order-request';

export interface ModifyOrder$Params {
  companyId: number;
      body: ModifyOrderRequest
}

export function modifyOrder(http: HttpClient, rootUrl: string, params: ModifyOrder$Params, context?: HttpContext): Observable<StrictHttpResponse<void>> {
  const rb = new RequestBuilder(rootUrl, modifyOrder.PATH, 'post');
  if (params) {
    rb.path('companyId', params.companyId, {});
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

modifyOrder.PATH = '/api/v1/order/modify/{companyId}';
