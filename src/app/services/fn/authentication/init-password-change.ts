/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { ChangeInitPasswordRequest } from '../../models/change-init-password-request';
import { ChangeInitPasswordResponse } from '../../models/change-init-password-response';

export interface InitPasswordChange$Params {
  body: ChangeInitPasswordRequest;
}

export function initPasswordChange(
  http: HttpClient,
  rootUrl: string,
  params: InitPasswordChange$Params,
  context?: HttpContext,
): Observable<StrictHttpResponse<ChangeInitPasswordResponse>> {
  const rb = new RequestBuilder(rootUrl, initPasswordChange.PATH, 'post');
  if (params) {
    rb.body(params.body, 'application/json');
  }

  return http
    .request(
      rb.build({ responseType: 'json', accept: 'application/json', context }),
    )
    .pipe(
      filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<ChangeInitPasswordResponse>;
      }),
    );
}

initPasswordChange.PATH = '/api/v1/auth/password/change/init';
