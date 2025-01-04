/* tslint:disable */
/* eslint-disable */

/**
 * Base class for WebSocket events
 */
export interface WebSocketEvent {

  /**
   * Event types for WebSocket events
   */
  eventType: 'NEW_ORDER' | 'HEARTBEAT' | 'DISCONNECTION' | 'SERVER_SIDE_DISCONNECTION' | 'APPROVED_ORDER' | 'REJECTED_ORDER' | 'APPROVAL_DEADLINE_PASSED';
}
