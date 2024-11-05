/* tslint:disable */
/* eslint-disable */
import { ProductDto } from '../models/product-dto';
export interface OrderDto {
  approvalDeadline?: string;
  companyId?: number;
  customerName?: string;
  deliveryAddress?: string;
  deliveryTime?: string;
  description?: string;
  id?: number;
  orderType?: 'GLOVO' | 'PYSZNE_PL';
  price?: number;
  products?: Array<ProductDto>;
  quantityProductsMap?: {
[key: string]: number;
};
  status?: 'WAITING_FOR_ACCEPTANCE' | 'IN_EXECUTION' | 'EXECUTED' | 'REJECTED';
}
