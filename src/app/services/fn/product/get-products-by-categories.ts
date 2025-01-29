/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { GetProductsByCategoriesResponse } from '../../models/get-products-by-categories-response';

export interface GetProductsByCategories$Params {
  companyId: number;
}

export function getProductsByCategories(http: HttpClient, rootUrl: string, params: GetProductsByCategories$Params, context?: HttpContext): Observable<StrictHttpResponse<GetProductsByCategoriesResponse>> {
  const rb = new RequestBuilder(rootUrl, getProductsByCategories.PATH, 'get');
  if (params) {
    rb.path('companyId', params.companyId, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<GetProductsByCategoriesResponse>;
    })
  );
}

getProductsByCategories.PATH = '/api/v1/product/menu-ordering/{companyId}';
