/* tslint:disable */
/* eslint-disable */
import { ProductCategoryDto } from '../models/product-category-dto';
import { ProductsPagedResult } from '../models/products-paged-result';
export interface GetPagedProductsResponse {
  pagedResult?: ProductsPagedResult;
  productCategories?: Array<ProductCategoryDto>;
}
