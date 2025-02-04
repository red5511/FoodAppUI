/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { ChangeProductCategoriesSortOrderRequest } from '../../models/change-product-categories-sort-order-request';

export interface ChangeProductCategoriesSortOrder$Params {
  companyId: number;
      body: ChangeProductCategoriesSortOrderRequest
}

export function changeProductCategoriesSortOrder(http: HttpClient, rootUrl: string, params: ChangeProductCategoriesSortOrder$Params, context?: HttpContext): Observable<StrictHttpResponse<void>> {
  const rb = new RequestBuilder(rootUrl, changeProductCategoriesSortOrder.PATH, 'put');
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

changeProductCategoriesSortOrder.PATH = '/api/v1/product-category/menu/category/{companyId}/change-order';
