/* tslint:disable */
/* eslint-disable */
import { ProductDto } from '../models/product-dto';
export interface OrderDto {
  companyId?: number;
  customerName?: string;
  deliveryAddress?: string;
  deliveryTime?: string;
  description?: string;
  id?: number;
  name?: string;
  orderType?: 'GLOVO' | 'PYSZNE_PL';
  price?: number;
  products?: Array<ProductDto>;
  status?: 'WAITING_FOR_ACCEPTANCE' | 'IN_EXECUTION' | 'EXECUTED' | 'REJECTED';
}
