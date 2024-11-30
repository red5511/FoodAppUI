/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { NewOrderWebSocketEvent } from '../../models/new-order-web-socket-event';
import { WebSocketEvent } from '../../models/web-socket-event';

export interface InitOrderWebSocketTopic2$Params {
      body: WebSocketEvent
}

export function initOrderWebSocketTopic2(http: HttpClient, rootUrl: string, params: InitOrderWebSocketTopic2$Params, context?: HttpContext): Observable<StrictHttpResponse<NewOrderWebSocketEvent>> {
  const rb = new RequestBuilder(rootUrl, initOrderWebSocketTopic2.PATH, 'post');
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

initOrderWebSocketTopic2.PATH = '/api/v1/development/forGeneratingApi';
