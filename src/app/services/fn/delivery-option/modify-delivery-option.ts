/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { ModifyDeliveryOptionRequest } from '../../models/modify-delivery-option-request';
import { ModifyDeliveryOptionResponse } from '../../models/modify-delivery-option-response';

export interface ModifyDeliveryOption$Params {
  companyId: number;
      body: ModifyDeliveryOptionRequest
}

export function modifyDeliveryOption(http: HttpClient, rootUrl: string, params: ModifyDeliveryOption$Params, context?: HttpContext): Observable<StrictHttpResponse<ModifyDeliveryOptionResponse>> {
  const rb = new RequestBuilder(rootUrl, modifyDeliveryOption.PATH, 'put');
  if (params) {
    rb.path('companyId', params.companyId, {});
    rb.body(params.body, 'application/json');
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<ModifyDeliveryOptionResponse>;
    })
  );
}

modifyDeliveryOption.PATH = '/api/v1/delivery-option/modify/{companyId}';
