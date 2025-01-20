/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { getPagedProducts } from '../fn/product/get-paged-products';
import { GetPagedProducts$Params } from '../fn/product/get-paged-products';
import { GetPagedProductsResponse } from '../models/get-paged-products-response';
import { saveProduct } from '../fn/product/save-product';
import { SaveProduct$Params } from '../fn/product/save-product';
import { saveProduct1 } from '../fn/product/save-product-1';
import { SaveProduct1$Params } from '../fn/product/save-product-1';
import { saveProduct2 } from '../fn/product/save-product-2';
import { SaveProduct2$Params } from '../fn/product/save-product-2';

@Injectable({ providedIn: 'root' })
export class ProductService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `saveProduct()` */
  static readonly SaveProductPath = '/api/v1/product/modify';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `saveProduct()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  saveProduct$Response(params: SaveProduct$Params, context?: HttpContext): Observable<StrictHttpResponse<string>> {
    return saveProduct(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `saveProduct$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  saveProduct(params: SaveProduct$Params, context?: HttpContext): Observable<string> {
    return this.saveProduct$Response(params, context).pipe(
      map((r: StrictHttpResponse<string>): string => r.body)
    );
  }

  /** Path part for operation `saveProduct1()` */
  static readonly SaveProduct1Path = '/api/v1/product/save';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `saveProduct1()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  saveProduct1$Response(params: SaveProduct1$Params, context?: HttpContext): Observable<StrictHttpResponse<string>> {
    return saveProduct1(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `saveProduct1$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  saveProduct1(params: SaveProduct1$Params, context?: HttpContext): Observable<string> {
    return this.saveProduct1$Response(params, context).pipe(
      map((r: StrictHttpResponse<string>): string => r.body)
    );
  }

  /** Path part for operation `getPagedProducts()` */
  static readonly GetPagedProductsPath = '/api/v1/product/pages';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getPagedProducts()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  getPagedProducts$Response(params: GetPagedProducts$Params, context?: HttpContext): Observable<StrictHttpResponse<GetPagedProductsResponse>> {
    return getPagedProducts(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getPagedProducts$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  getPagedProducts(params: GetPagedProducts$Params, context?: HttpContext): Observable<GetPagedProductsResponse> {
    return this.getPagedProducts$Response(params, context).pipe(
      map((r: StrictHttpResponse<GetPagedProductsResponse>): GetPagedProductsResponse => r.body)
    );
  }

  /** Path part for operation `saveProduct2()` */
  static readonly SaveProduct2Path = '/api/v1/product/delete';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `saveProduct2()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  saveProduct2$Response(params: SaveProduct2$Params, context?: HttpContext): Observable<StrictHttpResponse<string>> {
    return saveProduct2(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `saveProduct2$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  saveProduct2(params: SaveProduct2$Params, context?: HttpContext): Observable<string> {
    return this.saveProduct2$Response(params, context).pipe(
      map((r: StrictHttpResponse<string>): string => r.body)
    );
  }

}
