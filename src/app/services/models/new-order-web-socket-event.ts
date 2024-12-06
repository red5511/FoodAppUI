/* tslint:disable */
/* eslint-disable */
import { OrderDto } from '../models/order-dto';

/**
 * Event for a new order created via WebSocket
 */
export interface NewOrderWebSocketEvent {

  /**
   * Event types for WebSocket events
   */
  eventType: 'NEW_ORDER' | 'HEARTBEAT' | 'DISCONNECTION' | 'SERVER_SIDE_DISCONNECTION' | 'APPROVED_ORDER' | 'REJECTED_ORDER';
  order: OrderDto;
}
