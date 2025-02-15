/* tslint:disable */
/* eslint-disable */

/**
 * List of status models
 */
export interface OrderStatusModel {
  orderStatus: 'WAITING_FOR_ACCEPTANCE' | 'IN_EXECUTION' | 'EXECUTED' | 'REJECTED' | 'READY_FOR_PICK_UP' | 'NOT_ACCEPTED' | 'MODIFIED';
  translatedValue: string;
}
