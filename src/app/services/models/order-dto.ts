/* tslint:disable */
/* eslint-disable */
import { OrderProductDto } from '../models/order-product-dto';
export interface OrderDto {
  approvalDeadline?: string;
  companyId?: number;
  companyName?: string;
  customerName?: string;
  deliveryAddress?: string;
  deliveryTime?: string;
  description?: string;
  id?: number;
  orderProducts?: Array<OrderProductDto>;
  orderType?: 'GLOVO' | 'PYSZNE_PL';
  price?: number;
  status?: 'WAITING_FOR_ACCEPTANCE' | 'IN_EXECUTION' | 'EXECUTED' | 'REJECTED';
}
