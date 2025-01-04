/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { disconnectionWebSocketEvent } from '../fn/development/disconnection-web-socket-event';
import { DisconnectionWebSocketEvent } from '../models/disconnection-web-socket-event';
import { DisconnectionWebSocketEvent$Params } from '../fn/development/disconnection-web-socket-event';
import { ehh } from '../fn/development/ehh';
import { Ehh$Params } from '../fn/development/ehh';
import { ehh2 } from '../fn/development/ehh-2';
import { Ehh2$Params } from '../fn/development/ehh-2';
import { ehh3 } from '../fn/development/ehh-3';
import { Ehh3$Params } from '../fn/development/ehh-3';
import { ehh31 } from '../fn/development/ehh-31';
import { Ehh31$Params } from '../fn/development/ehh-31';
import { heartbeatWebSocketEvent } from '../fn/development/heartbeat-web-socket-event';
import { HeartbeatWebSocketEvent } from '../models/heartbeat-web-socket-event';
import { HeartbeatWebSocketEvent$Params } from '../fn/development/heartbeat-web-socket-event';
import { initOrderWebSocketTopic1 } from '../fn/development/init-order-web-socket-topic-1';
import { InitOrderWebSocketTopic1$Params } from '../fn/development/init-order-web-socket-topic-1';
import { NewOrderWebSocketEvent } from '../models/new-order-web-socket-event';
import { ServerSideDisconnectionWebSocketEvent } from '../models/server-side-disconnection-web-socket-event';

@Injectable({ providedIn: 'root' })
export class DevelopmentService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `initOrderWebSocketTopic1()` */
  static readonly InitOrderWebSocketTopic1Path = '/api/v1/development/forGeneratingApi';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `initOrderWebSocketTopic1()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  initOrderWebSocketTopic1$Response(params: InitOrderWebSocketTopic1$Params, context?: HttpContext): Observable<StrictHttpResponse<NewOrderWebSocketEvent>> {
    return initOrderWebSocketTopic1(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `initOrderWebSocketTopic1$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  initOrderWebSocketTopic1(params: InitOrderWebSocketTopic1$Params, context?: HttpContext): Observable<NewOrderWebSocketEvent> {
    return this.initOrderWebSocketTopic1$Response(params, context).pipe(
      map((r: StrictHttpResponse<NewOrderWebSocketEvent>): NewOrderWebSocketEvent => r.body)
    );
  }

  /** Path part for operation `ehh3()` */
  static readonly Ehh3Path = '/api/v1/development/forGeneratingApi7';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `ehh3()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  ehh3$Response(params: Ehh3$Params, context?: HttpContext): Observable<StrictHttpResponse<void>> {
    return ehh3(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `ehh3$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  ehh3(params: Ehh3$Params, context?: HttpContext): Observable<void> {
    return this.ehh3$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

  /** Path part for operation `ehh31()` */
  static readonly Ehh31Path = '/api/v1/development/forGeneratingApi6';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `ehh31()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  ehh31$Response(params: Ehh31$Params, context?: HttpContext): Observable<StrictHttpResponse<void>> {
    return ehh31(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `ehh31$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  ehh31(params: Ehh31$Params, context?: HttpContext): Observable<void> {
    return this.ehh31$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

  /** Path part for operation `ehh2()` */
  static readonly Ehh2Path = '/api/v1/development/forGeneratingApi5';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `ehh2()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  ehh2$Response(params: Ehh2$Params, context?: HttpContext): Observable<StrictHttpResponse<void>> {
    return ehh2(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `ehh2$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  ehh2(params: Ehh2$Params, context?: HttpContext): Observable<void> {
    return this.ehh2$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

  /** Path part for operation `ehh()` */
  static readonly EhhPath = '/api/v1/development/forGeneratingApi4';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `ehh()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  ehh$Response(params: Ehh$Params, context?: HttpContext): Observable<StrictHttpResponse<ServerSideDisconnectionWebSocketEvent>> {
    return ehh(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `ehh$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  ehh(params: Ehh$Params, context?: HttpContext): Observable<ServerSideDisconnectionWebSocketEvent> {
    return this.ehh$Response(params, context).pipe(
      map((r: StrictHttpResponse<ServerSideDisconnectionWebSocketEvent>): ServerSideDisconnectionWebSocketEvent => r.body)
    );
  }

  /** Path part for operation `disconnectionWebSocketEvent()` */
  static readonly DisconnectionWebSocketEventPath = '/api/v1/development/forGeneratingApi3';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `disconnectionWebSocketEvent()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  disconnectionWebSocketEvent$Response(params: DisconnectionWebSocketEvent$Params, context?: HttpContext): Observable<StrictHttpResponse<DisconnectionWebSocketEvent>> {
    return disconnectionWebSocketEvent(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `disconnectionWebSocketEvent$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  disconnectionWebSocketEvent(params: DisconnectionWebSocketEvent$Params, context?: HttpContext): Observable<DisconnectionWebSocketEvent> {
    return this.disconnectionWebSocketEvent$Response(params, context).pipe(
      map((r: StrictHttpResponse<DisconnectionWebSocketEvent>): DisconnectionWebSocketEvent => r.body)
    );
  }

  /** Path part for operation `heartbeatWebSocketEvent()` */
  static readonly HeartbeatWebSocketEventPath = '/api/v1/development/forGeneratingApi2';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `heartbeatWebSocketEvent()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  heartbeatWebSocketEvent$Response(params: HeartbeatWebSocketEvent$Params, context?: HttpContext): Observable<StrictHttpResponse<HeartbeatWebSocketEvent>> {
    return heartbeatWebSocketEvent(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `heartbeatWebSocketEvent$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  heartbeatWebSocketEvent(params: HeartbeatWebSocketEvent$Params, context?: HttpContext): Observable<HeartbeatWebSocketEvent> {
    return this.heartbeatWebSocketEvent$Response(params, context).pipe(
      map((r: StrictHttpResponse<HeartbeatWebSocketEvent>): HeartbeatWebSocketEvent => r.body)
    );
  }

}
