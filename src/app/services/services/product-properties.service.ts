/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { CreateProductPropertiesResponse } from '../models/create-product-properties-response';
import { saveProductProperties } from '../fn/product-properties/save-product-properties';
import { SaveProductProperties$Params } from '../fn/product-properties/save-product-properties';

@Injectable({ providedIn: 'root' })
export class ProductPropertiesService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `saveProductProperties()` */
  static readonly SaveProductPropertiesPath = '/api/v1/product-properties/save';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `saveProductProperties()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  saveProductProperties$Response(params: SaveProductProperties$Params, context?: HttpContext): Observable<StrictHttpResponse<CreateProductPropertiesResponse>> {
    return saveProductProperties(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `saveProductProperties$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  saveProductProperties(params: SaveProductProperties$Params, context?: HttpContext): Observable<CreateProductPropertiesResponse> {
    return this.saveProductProperties$Response(params, context).pipe(
      map((r: StrictHttpResponse<CreateProductPropertiesResponse>): CreateProductPropertiesResponse => r.body)
    );
  }

}
