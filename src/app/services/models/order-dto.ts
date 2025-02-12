/* tslint:disable */
/* eslint-disable */
import { OrderActions } from '../models/order-actions';
import { OrderProductDto } from '../models/order-product-dto';
export interface OrderDto {
  actions?: OrderActions;
  approvalDeadline?: string;
  companyId?: number;
  companyName?: string;
  createdDate?: string;
  customerName?: string;
  deliveryAddress?: string;
  deliveryCode?: string;
  description?: string;
  executionTime?: string;
  id?: number;
  orderProducts?: Array<OrderProductDto>;
  orderType?: 'GLOVO' | 'PYSZNE_PL';
  paymentMethod?: 'CASH' | 'CARD';
  price?: number;
  status?: 'WAITING_FOR_ACCEPTANCE' | 'IN_EXECUTION' | 'EXECUTED' | 'REJECTED' | 'READY_FOR_PICK_UP' | 'NOT_ACCEPTED';
  takeaway?: boolean;
}
