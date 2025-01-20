/* tslint:disable */
/* eslint-disable */
import { Address } from '../models/address';
import { OpenHours } from '../models/open-hours';
import { UserDto } from '../models/user-dto';
export interface CompanyDto {
  address: Address;
  createdDate: string;
  holding?: boolean;
  id: number;
  name: string;
  openHours?: OpenHours;
  users: Array<UserDto>;
  webSocketTopicName: string;
}
