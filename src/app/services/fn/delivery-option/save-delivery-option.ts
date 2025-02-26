/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { CreateDeliveryOptionRequest } from '../../models/create-delivery-option-request';
import { CreateDeliveryOptionResponse } from '../../models/create-delivery-option-response';

export interface SaveDeliveryOption$Params {
  companyId: number;
      body: CreateDeliveryOptionRequest
}

export function saveDeliveryOption(http: HttpClient, rootUrl: string, params: SaveDeliveryOption$Params, context?: HttpContext): Observable<StrictHttpResponse<CreateDeliveryOptionResponse>> {
  const rb = new RequestBuilder(rootUrl, saveDeliveryOption.PATH, 'post');
  if (params) {
    rb.path('companyId', params.companyId, {});
    rb.body(params.body, 'application/json');
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<CreateDeliveryOptionResponse>;
    })
  );
}

saveDeliveryOption.PATH = '/api/v1/delivery-option/save/{companyId}';
