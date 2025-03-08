/* tslint:disable */
/* eslint-disable */
import { ProductPropertyDto } from '../models/product-property-dto';
export interface ProductPropertiesDto {
  companyId?: number;
  id?: number;
  maxChosenOptions?: number;
  name?: string;
  productIds?: Array<number>;
  propertyList?: Array<ProductPropertyDto>;
  required?: boolean;
}
