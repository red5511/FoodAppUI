/* tslint:disable */
/* eslint-disable */
import { ProductDto } from '../models/product-dto';
export interface ProductCategoryDto {
  companyId?: number;
  id?: number;
  name?: string;
  products?: Array<ProductDto>;
}
