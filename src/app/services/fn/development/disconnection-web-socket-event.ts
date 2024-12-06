/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { DisconnectionWebSocketEvent } from '../../models/disconnection-web-socket-event';
import { WebSocketEvent } from '../../models/web-socket-event';

export interface DisconnectionWebSocketEvent$Params {
      body: WebSocketEvent
}

export function disconnectionWebSocketEvent(http: HttpClient, rootUrl: string, params: DisconnectionWebSocketEvent$Params, context?: HttpContext): Observable<StrictHttpResponse<DisconnectionWebSocketEvent>> {
  const rb = new RequestBuilder(rootUrl, disconnectionWebSocketEvent.PATH, 'post');
  if (params) {
    rb.body(params.body, 'application/json');
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<DisconnectionWebSocketEvent>;
    })
  );
}

disconnectionWebSocketEvent.PATH = '/api/v1/development/forGeneratingApi3';
