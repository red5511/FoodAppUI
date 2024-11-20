/* tslint:disable */
/* eslint-disable */

/**
 * List of date range models
 */
export interface DateRangeModel {
  dateRange?:
    | 'LAST_30_DAYS'
    | 'LAST_15_DAYS'
    | 'LAST_7_DAYS'
    | 'CUSTOM_DATE_RANGE';
  translatedValue?: string;
}
