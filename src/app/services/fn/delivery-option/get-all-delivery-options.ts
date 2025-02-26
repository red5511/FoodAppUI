/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { GetAllDeliveryOptionsResponse } from '../../models/get-all-delivery-options-response';

export interface GetAllDeliveryOptions$Params {
  companyId: number;
}

export function getAllDeliveryOptions(http: HttpClient, rootUrl: string, params: GetAllDeliveryOptions$Params, context?: HttpContext): Observable<StrictHttpResponse<GetAllDeliveryOptionsResponse>> {
  const rb = new RequestBuilder(rootUrl, getAllDeliveryOptions.PATH, 'get');
  if (params) {
    rb.path('companyId', params.companyId, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<GetAllDeliveryOptionsResponse>;
    })
  );
}

getAllDeliveryOptions.PATH = '/api/v1/delivery-option/get-all/{companyId}';
