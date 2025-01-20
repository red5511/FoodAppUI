/* tslint:disable */
/* eslint-disable */
import { Address } from '../models/address';
import { OpenHours } from '../models/open-hours';
export interface DashboardGetCompanyResponse {
  companyAddress?: Address;
  companyName?: string;
  openHours?: OpenHours;
}
