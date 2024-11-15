/* tslint:disable */
/* eslint-disable */
export interface GetStatisticsChartRequest {
  companyId?: number;
  dateFrom?: string;
  datePeriod?: 'DAY' | 'WEEK' | 'MONTH';
  dateRange?: 'LAST_30_DAYS' | 'LAST_15_DAYS' | 'LAST_7_DAYS' | 'CUSTOM_DATE_RANGE';
  dateTo?: string;
  productId?: number;
}
