/* tslint:disable */
/* eslint-disable */
import { Sort } from '../models/sort';
export interface GetUsersAdministrationRequest {
  dateFrom?: string;
  dateRange?: 'LAST_30_DAYS' | 'LAST_15_DAYS' | 'LAST_7_DAYS' | 'CUSTOM_DATE_RANGE';
  dateTo?: string;
  globalSearch?: string;
  page?: number;
  size?: number;
  sorts?: Array<Sort>;
}
