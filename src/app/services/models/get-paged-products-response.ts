/* tslint:disable */
/* eslint-disable */
import { ProductCategoryDto } from '../models/product-category-dto';
import { ProductPropertiesDto } from '../models/product-properties-dto';
import { ProductsPagedResult } from '../models/products-paged-result';
export interface GetPagedProductsResponse {
  pagedResult?: ProductsPagedResult;
  productCategories?: Array<ProductCategoryDto>;
  productPropertiesList?: Array<ProductPropertiesDto>;
}
