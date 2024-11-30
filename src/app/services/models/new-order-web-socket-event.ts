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
  eventType: 'NEW_ORDER' | 'HEARTBEAT';
  order: OrderDto;
}
