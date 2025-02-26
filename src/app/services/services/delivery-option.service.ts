/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { CreateDeliveryOptionResponse } from '../models/create-delivery-option-response';
import { deleteDeliveryOption } from '../fn/delivery-option/delete-delivery-option';
import { DeleteDeliveryOption$Params } from '../fn/delivery-option/delete-delivery-option';
import { getAllDeliveryOptions } from '../fn/delivery-option/get-all-delivery-options';
import { GetAllDeliveryOptions$Params } from '../fn/delivery-option/get-all-delivery-options';
import { GetAllDeliveryOptionsResponse } from '../models/get-all-delivery-options-response';
import { modifyDeliveryOption } from '../fn/delivery-option/modify-delivery-option';
import { ModifyDeliveryOption$Params } from '../fn/delivery-option/modify-delivery-option';
import { ModifyDeliveryOptionResponse } from '../models/modify-delivery-option-response';
import { saveDeliveryOption } from '../fn/delivery-option/save-delivery-option';
import { SaveDeliveryOption$Params } from '../fn/delivery-option/save-delivery-option';

@Injectable({ providedIn: 'root' })
export class DeliveryOptionService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `modifyDeliveryOption()` */
  static readonly ModifyDeliveryOptionPath = '/api/v1/delivery-option/modify/{companyId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `modifyDeliveryOption()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  modifyDeliveryOption$Response(params: ModifyDeliveryOption$Params, context?: HttpContext): Observable<StrictHttpResponse<ModifyDeliveryOptionResponse>> {
    return modifyDeliveryOption(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `modifyDeliveryOption$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  modifyDeliveryOption(params: ModifyDeliveryOption$Params, context?: HttpContext): Observable<ModifyDeliveryOptionResponse> {
    return this.modifyDeliveryOption$Response(params, context).pipe(
      map((r: StrictHttpResponse<ModifyDeliveryOptionResponse>): ModifyDeliveryOptionResponse => r.body)
    );
  }

  /** Path part for operation `saveDeliveryOption()` */
  static readonly SaveDeliveryOptionPath = '/api/v1/delivery-option/save/{companyId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `saveDeliveryOption()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  saveDeliveryOption$Response(params: SaveDeliveryOption$Params, context?: HttpContext): Observable<StrictHttpResponse<CreateDeliveryOptionResponse>> {
    return saveDeliveryOption(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `saveDeliveryOption$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  saveDeliveryOption(params: SaveDeliveryOption$Params, context?: HttpContext): Observable<CreateDeliveryOptionResponse> {
    return this.saveDeliveryOption$Response(params, context).pipe(
      map((r: StrictHttpResponse<CreateDeliveryOptionResponse>): CreateDeliveryOptionResponse => r.body)
    );
  }

  /** Path part for operation `getAllDeliveryOptions()` */
  static readonly GetAllDeliveryOptionsPath = '/api/v1/delivery-option/get-all/{companyId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getAllDeliveryOptions()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAllDeliveryOptions$Response(params: GetAllDeliveryOptions$Params, context?: HttpContext): Observable<StrictHttpResponse<GetAllDeliveryOptionsResponse>> {
    return getAllDeliveryOptions(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getAllDeliveryOptions$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  getAllDeliveryOptions(params: GetAllDeliveryOptions$Params, context?: HttpContext): Observable<GetAllDeliveryOptionsResponse> {
    return this.getAllDeliveryOptions$Response(params, context).pipe(
      map((r: StrictHttpResponse<GetAllDeliveryOptionsResponse>): GetAllDeliveryOptionsResponse => r.body)
    );
  }

  /** Path part for operation `deleteDeliveryOption()` */
  static readonly DeleteDeliveryOptionPath = '/api/v1/delivery-option/delete/{companyId}/{deliveryOptionId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `deleteDeliveryOption()` instead.
   *
   * This method doesn't expect any request body.
   */
  deleteDeliveryOption$Response(params: DeleteDeliveryOption$Params, context?: HttpContext): Observable<StrictHttpResponse<void>> {
    return deleteDeliveryOption(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `deleteDeliveryOption$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  deleteDeliveryOption(params: DeleteDeliveryOption$Params, context?: HttpContext): Observable<void> {
    return this.deleteDeliveryOption$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

}
