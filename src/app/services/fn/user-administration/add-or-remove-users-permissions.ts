/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { AddOrDeleteUsersPermissionsAdministrationRequest } from '../../models/add-or-delete-users-permissions-administration-request';

export interface AddOrRemoveUsersPermissions$Params {
      body: AddOrDeleteUsersPermissionsAdministrationRequest
}

export function addOrRemoveUsersPermissions(http: HttpClient, rootUrl: string, params: AddOrRemoveUsersPermissions$Params, context?: HttpContext): Observable<StrictHttpResponse<void>> {
  const rb = new RequestBuilder(rootUrl, addOrRemoveUsersPermissions.PATH, 'post');
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

addOrRemoveUsersPermissions.PATH = '/api/v1/admin-panel/users/add-or-remove-users-permissions';
