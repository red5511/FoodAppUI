/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { GetUsersResponse } from '../../models/get-users-response';

export interface GetCompanyUsers$Params {
  companyId: number;
}

export function getCompanyUsers(http: HttpClient, rootUrl: string, params: GetCompanyUsers$Params, context?: HttpContext): Observable<StrictHttpResponse<GetUsersResponse>> {
  const rb = new RequestBuilder(rootUrl, getCompanyUsers.PATH, 'get');
  if (params) {
    rb.path('companyId', params.companyId, {});
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<GetUsersResponse>;
    })
  );
}

getCompanyUsers.PATH = '/api/v1/admin-panel/users/{companyId}/users';
