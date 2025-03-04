/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { approveNewIncomingOrder } from '../fn/order/approve-new-incoming-order';
import { ApproveNewIncomingOrder$Params } from '../fn/order/approve-new-incoming-order';
import { CreateOrderRequestResponse } from '../models/create-order-request-response';
import { finalizeOrder } from '../fn/order/finalize-order';
import { FinalizeOrder$Params } from '../fn/order/finalize-order';
import { getOrdersConfig } from '../fn/order/get-orders-config';
import { GetOrdersConfig$Params } from '../fn/order/get-orders-config';
import { GetOrdersConfigResponse } from '../models/get-orders-config-response';
import { getOrdersForCompany } from '../fn/order/get-orders-for-company';
import { GetOrdersForCompany$Params } from '../fn/order/get-orders-for-company';
import { modifyOrder } from '../fn/order/modify-order';
import { ModifyOrder$Params } from '../fn/order/modify-order';
import { ModifyOrderResponse } from '../models/modify-order-response';
import { PagedOrdersResponse } from '../models/paged-orders-response';
import { rejectNewIncomingOrder } from '../fn/order/reject-new-incoming-order';
import { RejectNewIncomingOrder$Params } from '../fn/order/reject-new-incoming-order';
import { saveOrder } from '../fn/order/save-order';
import { SaveOrder$Params } from '../fn/order/save-order';

@Injectable({ providedIn: 'root' })
export class OrderService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `saveOrder()` */
  static readonly SaveOrderPath = '/api/v1/order/save/{companyId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `saveOrder()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  saveOrder$Response(params: SaveOrder$Params, context?: HttpContext): Observable<StrictHttpResponse<CreateOrderRequestResponse>> {
    return saveOrder(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `saveOrder$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  saveOrder(params: SaveOrder$Params, context?: HttpContext): Observable<CreateOrderRequestResponse> {
    return this.saveOrder$Response(params, context).pipe(
      map((r: StrictHttpResponse<CreateOrderRequestResponse>): CreateOrderRequestResponse => r.body)
    );
  }

  /** Path part for operation `rejectNewIncomingOrder()` */
  static readonly RejectNewIncomingOrderPath = '/api/v1/order/reject';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `rejectNewIncomingOrder()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  rejectNewIncomingOrder$Response(params: RejectNewIncomingOrder$Params, context?: HttpContext): Observable<StrictHttpResponse<void>> {
    return rejectNewIncomingOrder(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `rejectNewIncomingOrder$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  rejectNewIncomingOrder(params: RejectNewIncomingOrder$Params, context?: HttpContext): Observable<void> {
    return this.rejectNewIncomingOrder$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

  /** Path part for operation `getOrdersForCompany()` */
  static readonly GetOrdersForCompanyPath = '/api/v1/order/orders';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getOrdersForCompany()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  getOrdersForCompany$Response(params: GetOrdersForCompany$Params, context?: HttpContext): Observable<StrictHttpResponse<PagedOrdersResponse>> {
    return getOrdersForCompany(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getOrdersForCompany$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  getOrdersForCompany(params: GetOrdersForCompany$Params, context?: HttpContext): Observable<PagedOrdersResponse> {
    return this.getOrdersForCompany$Response(params, context).pipe(
      map((r: StrictHttpResponse<PagedOrdersResponse>): PagedOrdersResponse => r.body)
    );
  }

  /** Path part for operation `modifyOrder()` */
  static readonly ModifyOrderPath = '/api/v1/order/modify/{companyId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `modifyOrder()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  modifyOrder$Response(params: ModifyOrder$Params, context?: HttpContext): Observable<StrictHttpResponse<ModifyOrderResponse>> {
    return modifyOrder(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `modifyOrder$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  modifyOrder(params: ModifyOrder$Params, context?: HttpContext): Observable<ModifyOrderResponse> {
    return this.modifyOrder$Response(params, context).pipe(
      map((r: StrictHttpResponse<ModifyOrderResponse>): ModifyOrderResponse => r.body)
    );
  }

  /** Path part for operation `finalizeOrder()` */
  static readonly FinalizeOrderPath = '/api/v1/order/finalize/{companyId}/{orderId}';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `finalizeOrder()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  finalizeOrder$Response(params: FinalizeOrder$Params, context?: HttpContext): Observable<StrictHttpResponse<void>> {
    return finalizeOrder(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `finalizeOrder$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  finalizeOrder(params: FinalizeOrder$Params, context?: HttpContext): Observable<void> {
    return this.finalizeOrder$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

  /** Path part for operation `getOrdersConfig()` */
  static readonly GetOrdersConfigPath = '/api/v1/order/config';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `getOrdersConfig()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  getOrdersConfig$Response(params: GetOrdersConfig$Params, context?: HttpContext): Observable<StrictHttpResponse<GetOrdersConfigResponse>> {
    return getOrdersConfig(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `getOrdersConfig$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  getOrdersConfig(params: GetOrdersConfig$Params, context?: HttpContext): Observable<GetOrdersConfigResponse> {
    return this.getOrdersConfig$Response(params, context).pipe(
      map((r: StrictHttpResponse<GetOrdersConfigResponse>): GetOrdersConfigResponse => r.body)
    );
  }

  /** Path part for operation `approveNewIncomingOrder()` */
  static readonly ApproveNewIncomingOrderPath = '/api/v1/order/approve';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `approveNewIncomingOrder()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  approveNewIncomingOrder$Response(params: ApproveNewIncomingOrder$Params, context?: HttpContext): Observable<StrictHttpResponse<void>> {
    return approveNewIncomingOrder(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `approveNewIncomingOrder$Response()` instead.
   *
   * This method sends `application/json` and handles request body of type `application/json`.
   */
  approveNewIncomingOrder(params: ApproveNewIncomingOrder$Params, context?: HttpContext): Observable<void> {
    return this.approveNewIncomingOrder$Response(params, context).pipe(
      map((r: StrictHttpResponse<void>): void => r.body)
    );
  }

}
