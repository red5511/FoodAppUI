/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { InitOrderWebSocketTopicRequest } from '../../models/init-order-web-socket-topic-request';

export interface InitOrderWebSocketTopic1$Params {
      body: InitOrderWebSocketTopicRequest
}

export function initOrderWebSocketTopic1(http: HttpClient, rootUrl: string, params: InitOrderWebSocketTopic1$Params, context?: HttpContext): Observable<StrictHttpResponse<string>> {
  const rb = new RequestBuilder(rootUrl, initOrderWebSocketTopic1.PATH, 'post');
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

initOrderWebSocketTopic1.PATH = '/api/v1/websocket/init-main-topic';