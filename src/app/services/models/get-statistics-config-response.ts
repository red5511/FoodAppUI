/* tslint:disable */
/* eslint-disable */
import { ProductDto } from '../models/product-dto';
export interface GetStatisticsConfigResponse {
  datePeriods?: Array<'DAY' | 'WEEK' | 'MONTH'>;
  dateRanges?: Array<'LAST_30_DAYS' | 'LAST_15_DAYS_' | 'LAST_7_DAYS' | 'CUSTOM_DATE_RANGE'>;
  products?: Array<ProductDto>;
}
