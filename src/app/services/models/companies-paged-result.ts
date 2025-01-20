/* tslint:disable */
/* eslint-disable */
import { CompanyDto } from '../models/company-dto';
export interface CompaniesPagedResult {
  companies?: Array<CompanyDto>;
  totalRecords?: number;
}
