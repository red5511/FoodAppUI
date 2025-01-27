/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { CreateProductCategoryResponse } from '../models/create-product-category-response';
import { saveProductCategory } from '../fn/product-category/save-product-category';
import { SaveProductCategory$Params } from '../fn/product-category/save-product-category';

@Injectable({ providedIn: 'root' })
export class ProductCategoryService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `saveProductCategory()` */
  static readonly SaveProductCategoryPath = '/api/v1/product-category/save';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `saveProductCategory()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  saveProductCategory$Response(params: SaveProductCategory$Params, context?: HttpContext): Observable<StrictHttpResponse<CreateProductCategoryResponse>> {
    return saveProductCategory(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `saveProductCategory$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  saveProductCategory(params: SaveProductCategory$Params, context?: HttpContext): Observable<CreateProductCategoryResponse> {
    return this.saveProductCategory$Response(params, context).pipe(
      map((r: StrictHttpResponse<CreateProductCategoryResponse>): CreateProductCategoryResponse => r.body)
    );
  }

}
