/* tslint:disable */
/* eslint-disable */
import { OrderDto } from '../models/order-dto';
import { ProductDto } from '../models/product-dto';
export interface OrderProductDto {
  id?: number;
  order?: OrderDto;
  price?: number;
  product?: ProductDto;
  quantity?: number;
}
