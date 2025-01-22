/* tslint:disable */
/* eslint-disable */
import { ProductCategoryDto } from '../models/product-category-dto';
export interface ProductDto {
  companyId?: number;
  description?: string;
  id?: number;
  imgUrl?: string;
  name?: string;
  price?: number;
  productCategory?: ProductCategoryDto;
  soldOut?: boolean;
}
