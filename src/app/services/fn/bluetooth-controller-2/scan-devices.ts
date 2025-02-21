/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';


export interface ScanDevices$Params {
}

export function scanDevices(http: HttpClient, rootUrl: string, params?: ScanDevices$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<{
'authenticated'?: boolean;
'encrypted'?: boolean;
'trustedDevice'?: boolean;
'bluetoothAddress'?: string;
}>>> {
  const rb = new RequestBuilder(rootUrl, scanDevices.PATH, 'get');
  if (params) {
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<Array<{
      'authenticated'?: boolean;
      'encrypted'?: boolean;
      'trustedDevice'?: boolean;
      'bluetoothAddress'?: string;
      }>>;
    })
  );
}

scanDevices.PATH = '/scan';
