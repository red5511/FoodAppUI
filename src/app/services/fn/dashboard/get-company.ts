/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { DashboardGetCompanyResponse } from '../../models/dashboard-get-company-response';

export interface GetCompany$Params {
  companyId: number;
}

export function getCompany(http: HttpClient, rootUrl: string, params: GetCompany$Params, context?: HttpContext): Observable<StrictHttpResponse<DashboardGetCompanyResponse>> {
  const rb = new RequestBuilder(rootUrl, getCompany.PATH, 'get');
  if (params) {
    rb.path('companyId', params.companyId, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<DashboardGetCompanyResponse>;
    })
  );
}

getCompany.PATH = '/api/v1/dashboard/company/{companyId}';
