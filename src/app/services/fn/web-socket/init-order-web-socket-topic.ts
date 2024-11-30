/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { NewOrderWebSocketEvent } from '../../models/new-order-web-socket-event';

export interface InitOrderWebSocketTopic$Params {
      body: NewOrderWebSocketEvent
}

export function initOrderWebSocketTopic(http: HttpClient, rootUrl: string, params: InitOrderWebSocketTopic$Params, context?: HttpContext): Observable<StrictHttpResponse<string>> {
  const rb = new RequestBuilder(rootUrl, initOrderWebSocketTopic.PATH, 'post');
  if (params) {
    rb.body(params.body, 'application/json');
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<string>;
    })
  );
}

initOrderWebSocketTopic.PATH = '/api/v1/websocket/test';
