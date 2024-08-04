/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { sayHello } from '../fn/demo-controller/say-hello';
import { SayHello$Params } from '../fn/demo-controller/say-hello';
import { sayHello2 } from '../fn/demo-controller/say-hello-2';
import { SayHello2$Params } from '../fn/demo-controller/say-hello-2';

@Injectable({ providedIn: 'root' })
export class DemoControllerService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `sayHello()` */
  static readonly SayHelloPath = '/demo';

  /**
   * say Hello.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `sayHello()` instead.
   *
   * This method doesn't expect any request body.
   */
  sayHello$Response(params?: SayHello$Params, context?: HttpContext): Observable<StrictHttpResponse<string>> {
    return sayHello(this.http, this.rootUrl, params, context);
  }

  /**
   * say Hello.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `sayHello$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  sayHello(params?: SayHello$Params, context?: HttpContext): Observable<string> {
    return this.sayHello$Response(params, context).pipe(
      map((r: StrictHttpResponse<string>): string => r.body)
    );
  }

  /** Path part for operation `sayHello2()` */
  static readonly SayHello2Path = '/api/v1/auth/test';

  /**
   * say Hello2.
   *
   *
   *
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `sayHello2()` instead.
   *
   * This method doesn't expect any request body.
   */
  sayHello2$Response(params?: SayHello2$Params, context?: HttpContext): Observable<StrictHttpResponse<string>> {
    return sayHello2(this.http, this.rootUrl, params, context);
  }

  /**
   * say Hello2.
   *
   *
   *
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `sayHello2$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  sayHello2(params?: SayHello2$Params, context?: HttpContext): Observable<string> {
    return this.sayHello2$Response(params, context).pipe(
      map((r: StrictHttpResponse<string>): string => r.body)
    );
  }

}
