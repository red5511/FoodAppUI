/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { HeartbeatWebSocketEvent } from '../../models/heartbeat-web-socket-event';
import { WebSocketEvent } from '../../models/web-socket-event';

export interface HeartbeatWebSocketEvent$Params {
      body: WebSocketEvent
}

export function heartbeatWebSocketEvent(http: HttpClient, rootUrl: string, params: HeartbeatWebSocketEvent$Params, context?: HttpContext): Observable<StrictHttpResponse<HeartbeatWebSocketEvent>> {
  const rb = new RequestBuilder(rootUrl, heartbeatWebSocketEvent.PATH, 'post');
  if (params) {
    rb.body(params.body, 'application/json');
  }

  return http.request(
    rb.build({ responseType: 'json', accept: 'application/json', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return r as StrictHttpResponse<HeartbeatWebSocketEvent>;
    })
  );
}

heartbeatWebSocketEvent.PATH = '/api/v1/development/forGeneratingApi2';
