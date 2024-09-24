/* tslint:disable */
/* eslint-disable */
export interface OrderDto {
  companyId?: number;
  customerName?: string;
  deliveryAddress?: string;
  deliveryTime?: string;
  description?: string;
  name?: string;
  orderType?: 'GLOVO' | 'PYSZNE_PL';
  price?: number;
  productIds?: Array<number>;
  status?: 'WAITING_FOR_ACCEPTANCE' | 'IN_EXECUTION' | 'EXECUTED';
}
