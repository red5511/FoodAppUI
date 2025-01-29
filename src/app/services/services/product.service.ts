/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { deleteProduct } from '../fn/product/delete-product';
import { DeleteProduct$Params } from '../fn/product/delete-product';
import { getPagedProducts } from '../fn/product/get-paged-products';
import { GetPagedProducts$Params } from '../fn/product/get-paged-products';
import { GetPagedProductsResponse } from '../models/get-paged-products-response';
import { getProductsByCategories } from '../fn/product/get-products-by-categories';
import { GetProductsByCategories$Params } from '../fn/product/get-products-by-categories';
import { GetProductsByCategoriesResponse } from '../models/get-products-by-categories-response';
import { modifyProduct } from '../fn/product/modify-product';
import { ModifyProduct$Params } from '../fn/product/modify-product';
import { saveProduct } from '../fn/product/save-product';
import { SaveProduct$Params } from '../fn/product/save-product';

@Injectable({ providedIn: 'root' })
export class ProductService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `modifyProduct()` */
  static readonly ModifyProductPath = '/api/v1/product/modify';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `modifyProduct()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  modifyProduct$Response(params: ModifyProduct$Params, context?: HttpContext): Observable<StrictHttpResponse<void>> {
    return modifyProduct(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `modifyProduct$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  modifyProduct(params: ModifyProduct$Params, context?: HttpContext): Observable<void> {
    return this.modifyProduct$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

  /** Path part for operation `saveProduct()` */
  static readonly SaveProductPath = '/api/v1/product/save';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `saveProduct()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  saveProduct$Response(params: SaveProduct$Params, context?: HttpContext): Observable<StrictHttpResponse<void>> {
    return saveProduct(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `saveProduct$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  saveProduct(params: SaveProduct$Params, context?: HttpContext): Observable<void> {
    return this.saveProduct$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
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

  /** Path part for operation `getProductsByCategories()` */
  static readonly GetProductsByCategoriesPath = '/api/v1/product/menu-ordering/{companyId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getProductsByCategories()` instead.
   *
   * This method doesn't expect any request body.
   */
  getProductsByCategories$Response(params: GetProductsByCategories$Params, context?: HttpContext): Observable<StrictHttpResponse<GetProductsByCategoriesResponse>> {
    return getProductsByCategories(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getProductsByCategories$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getProductsByCategories(params: GetProductsByCategories$Params, context?: HttpContext): Observable<GetProductsByCategoriesResponse> {
    return this.getProductsByCategories$Response(params, context).pipe(
      map((r: StrictHttpResponse<GetProductsByCategoriesResponse>): GetProductsByCategoriesResponse => r.body)
    );
  }

  /** Path part for operation `deleteProduct()` */
  static readonly DeleteProductPath = '/api/v1/product/delete';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `deleteProduct()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  deleteProduct$Response(params: DeleteProduct$Params, context?: HttpContext): Observable<StrictHttpResponse<void>> {
    return deleteProduct(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `deleteProduct$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  deleteProduct(params: DeleteProduct$Params, context?: HttpContext): Observable<void> {
    return this.deleteProduct$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

}
