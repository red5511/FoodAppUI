/* tslint:disable */
/* eslint-disable */
export interface ApprovalDeadlinePassed {

  /**
   * Event types for WebSocket events
   */
  eventType: 'NEW_ORDER' | 'HEARTBEAT' | 'DISCONNECTION' | 'SERVER_SIDE_DISCONNECTION' | 'APPROVED_ORDER' | 'REJECTED_ORDER' | 'APPROVAL_DEADLINE_PASSED';
  orderId: number;
}
