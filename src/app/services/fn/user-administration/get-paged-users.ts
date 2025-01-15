/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { GetPagedUsersResponse } from '../../models/get-paged-users-response';
import { GetUsersAdministrationRequest } from '../../models/get-users-administration-request';

export interface GetPagedUsers$Params {
      body: GetUsersAdministrationRequest
}

export function getPagedUsers(http: HttpClient, rootUrl: string, params: GetPagedUsers$Params, context?: HttpContext): Observable<StrictHttpResponse<GetPagedUsersResponse>> {
  const rb = new RequestBuilder(rootUrl, getPagedUsers.PATH, 'post');
  if (params) {
    rb.body(params.body, 'application/json');
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<GetPagedUsersResponse>;
    })
  );
}

getPagedUsers.PATH = '/api/v1/admin-panel/users/users';
