/* tslint:disable */
/* eslint-disable */
import { Filter } from '../models/filter';
import { Sort } from '../models/sort';
export interface GetOrdersForCompanyRequest {
  companyId?: number;
  filters?: Array<Filter>;
  page?: number;
  size?: number;
  sorts?: Array<Sort>;
}
