/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { initOrderWebSocketTopic } from '../fn/web-socket/init-order-web-socket-topic';
import { InitOrderWebSocketTopic$Params } from '../fn/web-socket/init-order-web-socket-topic';

@Injectable({ providedIn: 'root' })
export class WebSocketService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `initOrderWebSocketTopic()` */
  static readonly InitOrderWebSocketTopicPath = '/api/v1/websocket/init-main-topic';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `initOrderWebSocketTopic()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  initOrderWebSocketTopic$Response(params: InitOrderWebSocketTopic$Params, context?: HttpContext): Observable<StrictHttpResponse<void>> {
    return initOrderWebSocketTopic(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `initOrderWebSocketTopic$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  initOrderWebSocketTopic(params: InitOrderWebSocketTopic$Params, context?: HttpContext): Observable<void> {
    return this.initOrderWebSocketTopic$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

}
