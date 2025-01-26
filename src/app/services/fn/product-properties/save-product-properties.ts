/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { CreateProductPropertiesRequest } from '../../models/create-product-properties-request';
import { CreateProductPropertiesResponse } from '../../models/create-product-properties-response';

export interface SaveProductProperties$Params {
      body: CreateProductPropertiesRequest
}

export function saveProductProperties(http: HttpClient, rootUrl: string, params: SaveProductProperties$Params, context?: HttpContext): Observable<StrictHttpResponse<CreateProductPropertiesResponse>> {
  const rb = new RequestBuilder(rootUrl, saveProductProperties.PATH, 'post');
  if (params) {
    rb.body(params.body, 'application/json');
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<CreateProductPropertiesResponse>;
    })
  );
}

saveProductProperties.PATH = '/api/v1/product-properties/save';
