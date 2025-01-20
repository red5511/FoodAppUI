/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { GetAllPermissionsResponse } from '../../models/get-all-permissions-response';

export interface GetAllPermissions$Params {
}

export function getAllPermissions(http: HttpClient, rootUrl: string, params?: GetAllPermissions$Params, context?: HttpContext): Observable<StrictHttpResponse<GetAllPermissionsResponse>> {
  const rb = new RequestBuilder(rootUrl, getAllPermissions.PATH, 'get');
  if (params) {
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<GetAllPermissionsResponse>;
    })
  );
}

getAllPermissions.PATH = '/api/v1/admin-panel/users/permissions';
