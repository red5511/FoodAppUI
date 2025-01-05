/* tslint:disable */
/* eslint-disable */

/**
 * Disconnection event via WebSocket
 */
export interface DisconnectionWebSocketEvent {
  companyId?: Array<number>;
  companyIds: Array<number>;

  /**
   * Event types for WebSocket events
   */
  eventType: 'NEW_ORDER' | 'HEARTBEAT' | 'DISCONNECTION' | 'SERVER_SIDE_DISCONNECTION' | 'APPROVED_ORDER' | 'REJECTED_ORDER' | 'APPROVAL_DEADLINE_PASSED';
  userId: number;
}
