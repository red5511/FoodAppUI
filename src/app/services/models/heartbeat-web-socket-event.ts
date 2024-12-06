/* tslint:disable */
/* eslint-disable */

/**
 * Heartbeat event via WebSocket
 */
export interface HeartbeatWebSocketEvent {
  companyId: number;

  /**
   * Event types for WebSocket events
   */
  eventType: 'NEW_ORDER' | 'HEARTBEAT' | 'DISCONNECTION' | 'SERVER_SIDE_DISCONNECTION' | 'APPROVED_ORDER' | 'REJECTED_ORDER';
  userId: number;
}
