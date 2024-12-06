/* tslint:disable */
/* eslint-disable */

/**
 * Disconnection event via WebSocket
 */
export interface DisconnectionWebSocketEvent {
  companyId: number;

  /**
   * Event types for WebSocket events
   */
  eventType: 'NEW_ORDER' | 'HEARTBEAT' | 'DISCONNECTION' | 'SERVER_SIDE_DISCONNECTION' | 'APPROVED_ORDER' | 'REJECTED_ORDER';
  orderReceivingTopicName: string;
  userId: number;
}
