/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

export interface ChangePassword1$Params {
  token: string;
}

export function changePassword1(
  http: HttpClient,
  rootUrl: string,
  params: ChangePassword1$Params,
  context?: HttpContext,
): Observable<StrictHttpResponse<string>> {
  const rb = new RequestBuilder(rootUrl, changePassword1.PATH, 'get');
  if (params) {
    rb.path('token', params.token, {});
  }

  return http
    .request(
      rb.build({ responseType: 'json', accept: 'application/json', context }),
    )
    .pipe(
      filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<string>;
      }),
    );
}

changePassword1.PATH = '/api/v1/auth/password/change/confirm/{token}';
