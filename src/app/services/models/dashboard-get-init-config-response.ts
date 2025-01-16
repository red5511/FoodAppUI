/* tslint:disable */
/* eslint-disable */
import { CompanyDto } from '../models/company-dto';
export interface DashboardGetInitConfigResponse {
  companyDataList: Array<CompanyDto>;
  permittedModules: Array<'ONLINE_ORDERS' | 'STATISTICS' | 'ORDERS_HISTORY' | 'RESTAURANT_ORDERS' | 'ADMIN_PANEL' | 'SUPER_ADMIN_PANEL'>;
  receivingOrdersActive?: boolean;
  userId: number;
}
