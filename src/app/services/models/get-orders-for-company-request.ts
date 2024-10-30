/* tslint:disable */
/* eslint-disable */
import { Filter } from '../models/filter';
import { Sort } from '../models/sort';
export interface GetOrdersForCompanyRequest {
  companyId?: number;
  description?: string;
  filters?: Array<Filter>;
  name?: string;
  orderStatuses?: Array<'WAITING_FOR_ACCEPTANCE' | 'IN_EXECUTION' | 'EXECUTED' | 'REJECTED'>;
  page?: number;
  price?: number;
  size?: number;
  sorts?: Array<Sort>;
}
