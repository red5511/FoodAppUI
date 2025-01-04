/* tslint:disable */
/* eslint-disable */
import { OrderActions } from '../models/order-actions';
import { OrderProductDto } from '../models/order-product-dto';
export interface OrderDto {
  actions?: OrderActions;
  approvalDeadline?: string;
  companyId?: number;
  companyName?: string;
  customerName?: string;
  deliveryAddress?: string;
  deliveryCode?: string;
  deliveryTime?: string;
  description?: string;
  id?: number;
  orderProducts?: Array<OrderProductDto>;
  orderType?: 'GLOVO' | 'PYSZNE_PL';
  price?: number;
  status?: 'WAITING_FOR_ACCEPTANCE' | 'IN_EXECUTION' | 'EXECUTED' | 'REJECTED' | 'READY_FOR_PICK_UP' | 'NOT_ACCEPTED';
}
