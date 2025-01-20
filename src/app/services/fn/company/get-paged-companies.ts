/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { GetCompanyAdministrationRequest } from '../../models/get-company-administration-request';
import { GetPagedCompaniesResponse } from '../../models/get-paged-companies-response';

export interface GetPagedCompanies$Params {
      body: GetCompanyAdministrationRequest
}

export function getPagedCompanies(http: HttpClient, rootUrl: string, params: GetPagedCompanies$Params, context?: HttpContext): Observable<StrictHttpResponse<GetPagedCompaniesResponse>> {
  const rb = new RequestBuilder(rootUrl, getPagedCompanies.PATH, 'post');
  if (params) {
    rb.body(params.body, 'application/json');
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<GetPagedCompaniesResponse>;
    })
  );
}

getPagedCompanies.PATH = '/api/v1/admin-panel/companies/pages';
