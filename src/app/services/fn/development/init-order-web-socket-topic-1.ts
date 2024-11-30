/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { NewOrderWebSocketEvent } from '../../models/new-order-web-socket-event';
import { WebSocketEvent } from '../../models/web-socket-event';

export interface InitOrderWebSocketTopic1$Params {
      body: WebSocketEvent
}

export function initOrderWebSocketTopic1(http: HttpClient, rootUrl: string, params: InitOrderWebSocketTopic1$Params, context?: HttpContext): Observable<StrictHttpResponse<NewOrderWebSocketEvent>> {
  const rb = new RequestBuilder(rootUrl, initOrderWebSocketTopic1.PATH, 'post');
  if (params) {
    rb.body(params.body, 'application/json');
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<NewOrderWebSocketEvent>;
    })
  );
}

initOrderWebSocketTopic1.PATH = '/api/v1/development/forGeneratingApi';
