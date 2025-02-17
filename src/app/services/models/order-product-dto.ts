/* tslint:disable */
/* eslint-disable */
import { OrderDto } from '../models/order-dto';
import { ProductDto } from '../models/product-dto';
import { ProductPropertiesDto } from '../models/product-properties-dto';
export interface OrderProductDto {
  id?: number;
  note?: string;
  order?: OrderDto;
  price?: number;
  product?: ProductDto;
  productPropertiesList?: Array<ProductPropertiesDto>;
  quantity?: number;
}
