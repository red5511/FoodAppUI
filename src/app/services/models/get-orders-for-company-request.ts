/* tslint:disable */
/* eslint-disable */
import { Sort } from '../models/sort';
export interface GetOrdersForCompanyRequest {
  companyIds?: Array<number>;
  dateFrom?: string;
  dateRange?: 'LAST_30_DAYS' | 'LAST_15_DAYS' | 'LAST_7_DAYS' | 'CUSTOM_DATE_RANGE';
  dateTo?: string;
  globalSearch?: string;
  page?: number;
  price?: number;
  size?: number;
  sorts?: Array<Sort>;
  statuses?: Array<'WAITING_FOR_ACCEPTANCE' | 'IN_EXECUTION' | 'EXECUTED' | 'REJECTED' | 'READY_FOR_PICK_UP' | 'NOT_ACCEPTED' | 'MODIFIED'>;
  validatableCompanyId?: number;
}
