/* tslint:disable */
/* eslint-disable */
import { OrderDto } from '../models/order-dto';
export interface CreateOrderRequest {
  order?: OrderDto;
  printViaBluetooth?: boolean;
}
