/* tslint:disable */
/* eslint-disable */
import { ProductDto } from '../models/product-dto';
export interface ProductsPagedResult {
  products?: Array<ProductDto>;
  totalRecords?: number;
}
