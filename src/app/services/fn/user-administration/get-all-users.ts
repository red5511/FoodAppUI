/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { GetUsersResponse } from '../../models/get-users-response';

export interface GetAllUsers$Params {
}

export function getAllUsers(http: HttpClient, rootUrl: string, params?: GetAllUsers$Params, context?: HttpContext): Observable<StrictHttpResponse<GetUsersResponse>> {
  const rb = new RequestBuilder(rootUrl, getAllUsers.PATH, 'get');
  if (params) {
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

getAllUsers.PATH = '/api/v1/admin-panel/users/users';
