/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { AddOrDeleteUsersCompaniesAdministrationRequest } from '../../models/add-or-delete-users-companies-administration-request';

export interface AddOrRemoveUsersCompanies$Params {
      body: AddOrDeleteUsersCompaniesAdministrationRequest
}

export function addOrRemoveUsersCompanies(http: HttpClient, rootUrl: string, params: AddOrRemoveUsersCompanies$Params, context?: HttpContext): Observable<StrictHttpResponse<void>> {
  const rb = new RequestBuilder(rootUrl, addOrRemoveUsersCompanies.PATH, 'post');
  if (params) {
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

addOrRemoveUsersCompanies.PATH = '/api/v1/admin-panel/companies/add-or-remove-users-companies';
