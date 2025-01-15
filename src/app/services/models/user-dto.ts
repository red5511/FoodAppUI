/* tslint:disable */
/* eslint-disable */
import { CompanyDto } from '../models/company-dto';
export interface UserDto {
  companies: Array<CompanyDto>;
  email: string;
  enabled: boolean;
  firstName: string;
  id: number;
  lastName: string;
  locked: boolean;
  phoneNumber: string;
}
