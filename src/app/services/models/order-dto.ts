/* tslint:disable */
/* eslint-disable */
import { Address } from '../models/address';
import { OrderActions } from '../models/order-actions';
import { OrderProductDto } from '../models/order-product-dto';
export interface OrderDto {
  actions?: OrderActions;
  approvalDeadline?: string;
  companyId?: number;
  companyName?: string;
  createdDate?: string;
  customerName?: string;
  deliveryAddress?: Address;
  deliveryCode?: string;
  description?: string;
  executionTime?: string;
  id?: number;
  orderProducts?: Array<OrderProductDto>;
  orderType?: 'OWN' | 'GLOVO' | 'PYSZNE_PL';
  paidWhenOrdered?: boolean;
  paymentMethod?: 'CASH' | 'CARD';
  price?: number;
  status?: 'WAITING_FOR_ACCEPTANCE' | 'IN_EXECUTION' | 'EXECUTED' | 'REJECTED' | 'READY_FOR_PICK_UP' | 'NOT_ACCEPTED' | 'MODIFIED';
  takeaway?: boolean;
}
