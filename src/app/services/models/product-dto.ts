/* tslint:disable */
/* eslint-disable */
import { ProductCategoryDto } from '../models/product-category-dto';
import { ProductPropertiesDto } from '../models/product-properties-dto';
export interface ProductDto {
  companyId?: number;
  description?: string;
  id?: number;
  imgUrl?: string;
  name?: string;
  price?: number;
  productCategory?: ProductCategoryDto;
  productPropertiesList?: Array<ProductPropertiesDto>;
  productStatus?: 'ACTIVE' | 'DELETED' | 'MODIFIED';
  soldOut?: boolean;
}
