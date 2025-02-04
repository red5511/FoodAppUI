/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { GetAllCategoriesResponse } from '../../models/get-all-categories-response';

export interface GetAllCategories$Params {
  companyId: number;
}

export function getAllCategories(http: HttpClient, rootUrl: string, params: GetAllCategories$Params, context?: HttpContext): Observable<StrictHttpResponse<GetAllCategoriesResponse>> {
  const rb = new RequestBuilder(rootUrl, getAllCategories.PATH, 'get');
  if (params) {
    rb.path('companyId', params.companyId, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<GetAllCategoriesResponse>;
    })
  );
}

getAllCategories.PATH = '/api/v1/product-category/menu/category/{companyId}';
