/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { ModifyProductRequest } from '../../models/modify-product-request';

export interface SaveProduct$Params {
  body: ModifyProductRequest;
}

export function saveProduct(
  http: HttpClient,
  rootUrl: string,
  params: SaveProduct$Params,
  context?: HttpContext,
): Observable<StrictHttpResponse<string>> {
  const rb = new RequestBuilder(rootUrl, saveProduct.PATH, 'put');
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
        return r as StrictHttpResponse<string>;
      }),
    );
}

saveProduct.PATH = '/api/v1/product/modify';
