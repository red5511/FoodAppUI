/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { AddOrDeleteCompaniesUsersAdministrationRequest } from '../../models/add-or-delete-companies-users-administration-request';

export interface AddOrRemoveCompaniesUsers$Params {
      body: AddOrDeleteCompaniesUsersAdministrationRequest
}

export function addOrRemoveCompaniesUsers(http: HttpClient, rootUrl: string, params: AddOrRemoveCompaniesUsers$Params, context?: HttpContext): Observable<StrictHttpResponse<void>> {
  const rb = new RequestBuilder(rootUrl, addOrRemoveCompaniesUsers.PATH, 'post');
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

addOrRemoveCompaniesUsers.PATH = '/api/v1/admin-panel/users/add-or-remove-companies-users';
