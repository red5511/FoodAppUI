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
import { initOrderWebSocketTopic1 } from '../fn/web-socket/init-order-web-socket-topic-1';
import { InitOrderWebSocketTopic1$Params } from '../fn/web-socket/init-order-web-socket-topic-1';

@Injectable({ providedIn: 'root' })
export class WebSocketService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `initOrderWebSocketTopic()` */
  static readonly InitOrderWebSocketTopicPath = '/api/v1/websocket/test';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `initOrderWebSocketTopic()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  initOrderWebSocketTopic$Response(params: InitOrderWebSocketTopic$Params, context?: HttpContext): Observable<StrictHttpResponse<string>> {
    return initOrderWebSocketTopic(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `initOrderWebSocketTopic$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  initOrderWebSocketTopic(params: InitOrderWebSocketTopic$Params, context?: HttpContext): Observable<string> {
    return this.initOrderWebSocketTopic$Response(params, context).pipe(
      map((r: StrictHttpResponse<string>): string => r.body)
    );
  }

  /** Path part for operation `initOrderWebSocketTopic1()` */
  static readonly InitOrderWebSocketTopic1Path = '/api/v1/websocket/init-main-topic';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `initOrderWebSocketTopic1()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  initOrderWebSocketTopic1$Response(params: InitOrderWebSocketTopic1$Params, context?: HttpContext): Observable<StrictHttpResponse<string>> {
    return initOrderWebSocketTopic1(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `initOrderWebSocketTopic1$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  initOrderWebSocketTopic1(params: InitOrderWebSocketTopic1$Params, context?: HttpContext): Observable<string> {
    return this.initOrderWebSocketTopic1$Response(params, context).pipe(
      map((r: StrictHttpResponse<string>): string => r.body)
    );
  }

}
