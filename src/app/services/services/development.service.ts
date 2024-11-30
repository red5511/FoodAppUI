/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { initOrderWebSocketTopic2 } from '../fn/development/init-order-web-socket-topic-2';
import { InitOrderWebSocketTopic2$Params } from '../fn/development/init-order-web-socket-topic-2';
import { NewOrderWebSocketEvent } from '../models/new-order-web-socket-event';

@Injectable({ providedIn: 'root' })
export class DevelopmentService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `initOrderWebSocketTopic2()` */
  static readonly InitOrderWebSocketTopic2Path = '/api/v1/development/forGeneratingApi';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `initOrderWebSocketTopic2()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  initOrderWebSocketTopic2$Response(params: InitOrderWebSocketTopic2$Params, context?: HttpContext): Observable<StrictHttpResponse<NewOrderWebSocketEvent>> {
    return initOrderWebSocketTopic2(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `initOrderWebSocketTopic2$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  initOrderWebSocketTopic2(params: InitOrderWebSocketTopic2$Params, context?: HttpContext): Observable<NewOrderWebSocketEvent> {
    return this.initOrderWebSocketTopic2$Response(params, context).pipe(
      map((r: StrictHttpResponse<NewOrderWebSocketEvent>): NewOrderWebSocketEvent => r.body)
    );
  }

}
