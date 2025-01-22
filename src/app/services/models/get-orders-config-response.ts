/* tslint:disable */
/* eslint-disable */
import { DateRangeModel } from '../models/date-range-model';
import { OrderStatusModel } from '../models/order-status-model';
export interface GetOrdersConfigResponse {

  /**
   * List of date range models
   */
  dataRangeModels: Array<DateRangeModel>;

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
