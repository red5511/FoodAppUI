/* tslint:disable */
/* eslint-disable */
import { OrderStatusModel } from '../models/order-status-model';
export interface GetOrdersConfigResponse {

  /**
   * List of status models
   */
  orderStatusModels: Array<OrderStatusModel>;
}
