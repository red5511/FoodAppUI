/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { DashboardGetInitConfigResponse } from '../../models/dashboard-get-init-config-response';

export interface GetConfig$Params {
}

export function getConfig(http: HttpClient, rootUrl: string, params?: GetConfig$Params, context?: HttpContext): Observable<StrictHttpResponse<DashboardGetInitConfigResponse>> {
  const rb = new RequestBuilder(rootUrl, getConfig.PATH, 'get');
  if (params) {
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<DashboardGetInitConfigResponse>;
    })
  );
}

getConfig.PATH = '/api/v1/dashboard/config/';
