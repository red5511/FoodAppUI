/* tslint:disable */
/* eslint-disable */
import { OpenHours } from '../models/open-hours';
export interface SaveCompanyRequest {
  address?: string;
  name?: string;
  openHours?: OpenHours;
  userEmail?: string;
}
