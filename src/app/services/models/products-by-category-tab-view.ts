/* tslint:disable */
/* eslint-disable */
import { ProductDto } from '../models/product-dto';
export interface ProductsByCategoryTabView {
  categoryTabTitle?: string;
  productsByCategoryList?: Array<{
[key: string]: Array<ProductDto>;
}>;
}
