/* tslint:disable */
/* eslint-disable */
import { CompanyDto } from '../models/company-dto';
export interface DashboardGetInitConfigResponse {
  companyDataList: Array<CompanyDto>;
  permittedModules: Array<'LIVE_PANEL' | 'STATISTICS' | 'ORDERS' | 'RESTAURANT_ORDER'>;
  receivingOrdersActive?: boolean;
  userId: number;
}
