/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { initOrderWebSocketTopic1 } from '../fn/development/init-order-web-socket-topic-1';
import { InitOrderWebSocketTopic1$Params } from '../fn/development/init-order-web-socket-topic-1';
import { NewOrderWebSocketEvent } from '../models/new-order-web-socket-event';

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

}
