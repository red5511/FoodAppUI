/* tslint:disable */
/* eslint-disable */

/**
 * Base class for WebSocket events
 */
export interface WebSocketEvent {

  /**
   * Event types for WebSocket events
   */
  eventType: 'NEW_ORDER' | 'HEARTBEAT';
}
