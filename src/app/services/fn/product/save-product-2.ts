/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { DeleteProductRequest } from '../../models/delete-product-request';

export interface SaveProduct2$Params {
  body: DeleteProductRequest;
}

export function saveProduct2(
  http: HttpClient,
  rootUrl: string,
  params: SaveProduct2$Params,
  context?: HttpContext,
): Observable<StrictHttpResponse<string>> {
  const rb = new RequestBuilder(rootUrl, saveProduct2.PATH, 'delete');
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

saveProduct2.PATH = '/api/v1/product/delete';
