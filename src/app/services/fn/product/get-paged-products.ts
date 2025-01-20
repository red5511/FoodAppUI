/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { GetPagedProductsResponse } from '../../models/get-paged-products-response';
import { GetProductsRequest } from '../../models/get-products-request';

export interface GetPagedProducts$Params {
      body: GetProductsRequest
}

export function getPagedProducts(http: HttpClient, rootUrl: string, params: GetPagedProducts$Params, context?: HttpContext): Observable<StrictHttpResponse<GetPagedProductsResponse>> {
  const rb = new RequestBuilder(rootUrl, getPagedProducts.PATH, 'post');
  if (params) {
    rb.body(params.body, 'application/json');
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<GetPagedProductsResponse>;
    })
  );
}

getPagedProducts.PATH = '/api/v1/product/pages';
