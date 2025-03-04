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
  delivery?: boolean;
  deliveryAddress?: Address;
  deliveryCode?: string;
  deliveryNote?: string;
  deliveryPrice?: number;
  description?: string;
  displayableId?: number;
  executionTime?: string;
  foodPrice?: number;
  id?: number;
  orderProducts?: Array<OrderProductDto>;
  orderType?: 'OWN' | 'GLOVO' | 'PYSZNE_PL';
  paidWhenOrdered?: boolean;
  paymentMethod?: 'CASH' | 'CARD';
  status?: 'WAITING_FOR_ACCEPTANCE' | 'IN_EXECUTION' | 'EXECUTED' | 'REJECTED' | 'READY_FOR_PICK_UP' | 'NOT_ACCEPTED' | 'MODIFIED';
  takeaway?: boolean;
  totalPrice?: number;
}
