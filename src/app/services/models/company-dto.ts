/* tslint:disable */
/* eslint-disable */
import { OpenHours } from '../models/open-hours';
export interface CompanyDto {
  address?: string;
  companyType?: 'FOOD';
  id?: number;
  name?: string;
  openHours?: OpenHours;
  receivingOrdersActive?: boolean;
  webSocketTopicName?: string;
}
