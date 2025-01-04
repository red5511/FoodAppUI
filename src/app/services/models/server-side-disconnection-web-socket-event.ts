/* tslint:disable */
/* eslint-disable */
export interface ServerSideDisconnectionWebSocketEvent {

  /**
   * Event types for WebSocket events
   */
  eventType: 'NEW_ORDER' | 'HEARTBEAT' | 'DISCONNECTION' | 'SERVER_SIDE_DISCONNECTION' | 'APPROVED_ORDER' | 'REJECTED_ORDER' | 'APPROVAL_DEADLINE_PASSED';
  userId: number;
}
