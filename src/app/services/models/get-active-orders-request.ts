/* tslint:disable */
/* eslint-disable */
import { Sort } from '../models/sort';
export interface GetActiveOrdersRequest {
  companyIds: Array<number>;
  isWaitingToAcceptanceSection: boolean;
  sorts?: Array<Sort>;
}
