/* tslint:disable */
/* eslint-disable */
import { OrderStatusModel } from '../models/order-status-model';
export interface GetOrdersConfigResponse {

  /**
   * List of status models
   */
  orderStatusModels: Array<OrderStatusModel>;

  /**
   * Map of severity
   */
  statusSeverityMap: {
[key: string]: 'info' | 'warning' | 'success' | 'danger' | 'contrast';
};
}
