/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { changeProductCategoriesSortOrder } from '../fn/product-category/change-product-categories-sort-order';
import { ChangeProductCategoriesSortOrder$Params } from '../fn/product-category/change-product-categories-sort-order';
import { CreateProductCategoryResponse } from '../models/create-product-category-response';
import { deleteProductCategory } from '../fn/product-category/delete-product-category';
import { DeleteProductCategory$Params } from '../fn/product-category/delete-product-category';
import { deleteProductCategoryWithProducts } from '../fn/product-category/delete-product-category-with-products';
import { DeleteProductCategoryWithProducts$Params } from '../fn/product-category/delete-product-category-with-products';
import { getAllCategories } from '../fn/product-category/get-all-categories';
import { GetAllCategories$Params } from '../fn/product-category/get-all-categories';
import { GetAllCategoriesResponse } from '../models/get-all-categories-response';
import { modifyProductCategory } from '../fn/product-category/modify-product-category';
import { ModifyProductCategory$Params } from '../fn/product-category/modify-product-category';
import { saveProductCategory } from '../fn/product-category/save-product-category';
import { SaveProductCategory$Params } from '../fn/product-category/save-product-category';

@Injectable({ providedIn: 'root' })
export class ProductCategoryService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `changeProductCategoriesSortOrder()` */
  static readonly ChangeProductCategoriesSortOrderPath = '/api/v1/product-category/menu/category/{companyId}/change-order';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `changeProductCategoriesSortOrder()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  changeProductCategoriesSortOrder$Response(params: ChangeProductCategoriesSortOrder$Params, context?: HttpContext): Observable<StrictHttpResponse<void>> {
    return changeProductCategoriesSortOrder(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `changeProductCategoriesSortOrder$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  changeProductCategoriesSortOrder(params: ChangeProductCategoriesSortOrder$Params, context?: HttpContext): Observable<void> {
    return this.changeProductCategoriesSortOrder$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
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

  /** Path part for operation `modifyProductCategory()` */
  static readonly ModifyProductCategoryPath = '/api/v1/product-category/modify';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `modifyProductCategory()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  modifyProductCategory$Response(params: ModifyProductCategory$Params, context?: HttpContext): Observable<StrictHttpResponse<void>> {
    return modifyProductCategory(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `modifyProductCategory$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  modifyProductCategory(params: ModifyProductCategory$Params, context?: HttpContext): Observable<void> {
    return this.modifyProductCategory$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

  /** Path part for operation `getAllCategories()` */
  static readonly GetAllCategoriesPath = '/api/v1/product-category/menu/category/{companyId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getAllCategories()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAllCategories$Response(params: GetAllCategories$Params, context?: HttpContext): Observable<StrictHttpResponse<GetAllCategoriesResponse>> {
    return getAllCategories(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getAllCategories$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAllCategories(params: GetAllCategories$Params, context?: HttpContext): Observable<GetAllCategoriesResponse> {
    return this.getAllCategories$Response(params, context).pipe(
      map((r: StrictHttpResponse<GetAllCategoriesResponse>): GetAllCategoriesResponse => r.body)
    );
  }

  /** Path part for operation `deleteProductCategory()` */
  static readonly DeleteProductCategoryPath = '/api/v1/product-category/delete';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `deleteProductCategory()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  deleteProductCategory$Response(params: DeleteProductCategory$Params, context?: HttpContext): Observable<StrictHttpResponse<void>> {
    return deleteProductCategory(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `deleteProductCategory$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  deleteProductCategory(params: DeleteProductCategory$Params, context?: HttpContext): Observable<void> {
    return this.deleteProductCategory$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

  /** Path part for operation `deleteProductCategoryWithProducts()` */
  static readonly DeleteProductCategoryWithProductsPath = '/api/v1/product-category/delete-with-products';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `deleteProductCategoryWithProducts()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  deleteProductCategoryWithProducts$Response(params: DeleteProductCategoryWithProducts$Params, context?: HttpContext): Observable<StrictHttpResponse<void>> {
    return deleteProductCategoryWithProducts(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `deleteProductCategoryWithProducts$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  deleteProductCategoryWithProducts(params: DeleteProductCategoryWithProducts$Params, context?: HttpContext): Observable<void> {
    return this.deleteProductCategoryWithProducts$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

}
