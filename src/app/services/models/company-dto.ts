/* tslint:disable */
/* eslint-disable */
import { OpenHours } from '../models/open-hours';
export interface CompanyDto {
  address: string;
  companyType?: 'FOOD';
  holding?: boolean;
  id: number;
  name: string;
  openHours?: OpenHours;
  receivingOrdersActive?: boolean;
  webSocketTopicName: string;
}
