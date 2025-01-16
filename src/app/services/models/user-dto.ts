/* tslint:disable */
/* eslint-disable */
import { CompanyDto } from '../models/company-dto';
export interface UserDto {
  companies: Array<CompanyDto>;
  createdDate: string;
  email: string;
  enabled: boolean;
  firstName: string;
  id: number;
  lastName: string;
  locked: boolean;
  permissions: Array<'VIEW_ONLINE_ORDERING' | 'VIEW_STATISTICS' | 'VIEW_ORDERS_HISTORY' | 'VIEW_RESTAURANT_ORDERING' | 'SUPER_ADMINISTRATOR'>;
  phoneNumber: string;
}
