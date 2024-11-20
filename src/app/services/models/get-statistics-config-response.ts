/* tslint:disable */
/* eslint-disable */
import { DatePeriodModel } from '../models/date-period-model';
import { DateRangeModel } from '../models/date-range-model';
import { ProductDto } from '../models/product-dto';
export interface GetStatisticsConfigResponse {
  /**
   * List of date range models
   */
  dataRangeModels: Array<DateRangeModel>;

  /**
   * List of date period models
   */
  datePeriodModels: Array<DatePeriodModel>;

  /**
   * List of products
   */
  products: Array<ProductDto>;
}
