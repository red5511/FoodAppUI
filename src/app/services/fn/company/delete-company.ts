/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { DeleteCompanyRequest } from '../../models/delete-company-request';

export interface DeleteCompany$Params {
  body: DeleteCompanyRequest;
}

export function deleteCompany(
  http: HttpClient,
  rootUrl: string,
  params: DeleteCompany$Params,
  context?: HttpContext,
): Observable<StrictHttpResponse<string>> {
  const rb = new RequestBuilder(rootUrl, deleteCompany.PATH, 'delete');
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
        return r as StrictHttpResponse<string>;
      }),
    );
}

deleteCompany.PATH = '/api/v1/administration/company/delete';
