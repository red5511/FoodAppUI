/* tslint:disable */
/* eslint-disable */
import { Address } from '../models/address';
import { OpenHours } from '../models/open-hours';
import { UserDto } from '../models/user-dto';
export interface CompanyDto {
  address: Address;
  companyType?: 'FOOD';
  createdDate: string;
  holding?: boolean;
  id: number;
  name: string;
  openHours?: OpenHours;
  receivingOrdersActive?: boolean;
  users: Array<UserDto>;
  webSocketTopicName: string;
}
