/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { GetAllCompaniesResponse } from '../../models/get-all-companies-response';

export interface GetAllCompanies$Params {
}

export function getAllCompanies(http: HttpClient, rootUrl: string, params?: GetAllCompanies$Params, context?: HttpContext): Observable<StrictHttpResponse<GetAllCompaniesResponse>> {
  const rb = new RequestBuilder(rootUrl, getAllCompanies.PATH, 'get');
  if (params) {
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<GetAllCompaniesResponse>;
    })
  );
}

getAllCompanies.PATH = '/api/v1/administration/company/companies';
