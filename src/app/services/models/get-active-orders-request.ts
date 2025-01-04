/* tslint:disable */
/* eslint-disable */
import { Sort } from '../models/sort';
export interface GetActiveOrdersRequest {
  isWaitingToAcceptanceSection?: boolean;
  sorts?: Array<Sort>;
}
