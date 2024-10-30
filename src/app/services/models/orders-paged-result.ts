/* tslint:disable */
/* eslint-disable */
import { OrderDto } from '../models/order-dto';
export interface OrdersPagedResult {
  orderList?: Array<OrderDto>;
  totalRecords?: number;
}
