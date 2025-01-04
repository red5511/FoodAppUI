import { Injectable } from '@angular/core';
import {
  ApprovalDeadlinePassed,
  ApprovedOrderWebSocketEvent,
  DisconnectionWebSocketEvent,
  HeartbeatWebSocketEvent,
  NewOrderWebSocketEvent,
  OrderDto,
  ServerSideDisconnectionWebSocketEvent,
  WebSocketEvent,
} from '../models';
import { BehaviorSubject, concatMapTo, Subject } from 'rxjs';
import { ContextService } from '../context/context.service';

export interface OrderHandledInfo {
  orderId: number;
  gotApproved?: boolean;
  isNewOrder?: boolean;
  apporvalDeadlinePassed?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class WebSocketEventHandler {
  // sluzy to poinformowania reszty ze order zostal zaakceptowany/odrzucony
  private orderProcessedSubject = new Subject<OrderHandledInfo>();
  orderProcessedVisibility$ = this.orderProcessedSubject.asObservable();

  // sluzy to poinformowania reszty ze przyszedl nowy order i mozna go zaakceptowac/odrzucic
  // private newOrderSubject = new Subject<OrderHandledInfo>();
  // newOrDeadlinePassedSubjectVisibility$ = this.newOrderSubject.asObservable();

  // // sluzy to poinformowania reszty ze nowy order ktory przyszedl zostal zaakceptowany/odrzucony przez innego usera
  // private newOrderHandledByOtherUser = new Subject<OrderHandledInfo>();
  // newOrderHandledByOtherUserVisibility$ =
  //   this.newOrderHandledByOtherUser.asObservable();

  constructor(private contextService: ContextService) {}

  handleEvent(event: WebSocketEvent) {
    if (event) {
      if (event.eventType === 'NEW_ORDER') {
        console.log(new Date().toTimeString(), event);
        this.handleNewOrderEvent(event as NewOrderWebSocketEvent);
      } else if (event.eventType === 'SERVER_SIDE_DISCONNECTION') {
        this.handleServerSideDisconnectionEvent(
          event as ServerSideDisconnectionWebSocketEvent
        );
      } else if (event.eventType === 'APPROVED_ORDER') {
        this.handleApprovedOrderWebSocketEvent(
          event as ApprovedOrderWebSocketEvent
        );
      } else if (event.eventType === 'REJECTED_ORDER') {
        this.handleRejectedOrderWebSocketEvent(
          event as ApprovedOrderWebSocketEvent
        );
      } else if (event.eventType === 'APPROVAL_DEADLINE_PASSED') {
        this.handleApprovalDeadlinePassedWebSocketEvent(
          event as ApprovalDeadlinePassed
        );
      }
    }
  }
  handleApprovalDeadlinePassedWebSocketEvent(event: ApprovalDeadlinePassed) {
      this.orderProcessedSubject.next({
        orderId: event.orderId!,
        apporvalDeadlinePassed: true,
      });
  }

  handleApprovedOrderWebSocketEvent(event: ApprovedOrderWebSocketEvent) {
    this.orderProcessedSubject.next({
      orderId: event.orderId,
      gotApproved: true,
    });
  }

  handleRejectedOrderWebSocketEvent(event: ApprovedOrderWebSocketEvent) {
    this.orderProcessedSubject.next({
      orderId: event.orderId,
      gotApproved: false,
    });
  }

  handleServerSideDisconnectionEvent(
    event: ServerSideDisconnectionWebSocketEvent
  ) {
    if (this.contextService.getUserId() === event.userId) {
      this.contextService.setUserReceivingOrdersActive(false);
    }
  }

  handleNewOrderEvent(event: NewOrderWebSocketEvent) {
    const order = event.order;
    if (order) {
      this.orderProcessedSubject.next({
        orderId: order.id!,
        isNewOrder: true,
      });
    }
  }

  sendHeartbeatEvent(destination: string, socketClient: any) {
    const companyId = this.contextService.getCompanyId();
    const userId = this.contextService.getUserId();
    const topicName = this.contextService.getMainWebSocketTopicName();
    const event: HeartbeatWebSocketEvent = {
      eventType: 'HEARTBEAT',
      companyId: companyId ?? -999,
      userId: userId ?? -999,
      orderReceivingTopicName: topicName ?? ';(',
    };
    socketClient.send(
      '/app/heartbeat', // Backend endpoint to send the event to
      {}, // Optional headers
      JSON.stringify(event) // The message payload
    );
    console.log(`Event sent to ${destination}:`, event);
  }

  sendDisconnectionEvent(socketClient: any) {
    const companyId = this.contextService.getCompanyId();
    const userId = this.contextService.getUserId();
    const topicName = this.contextService.getMainWebSocketTopicName();
    const event: DisconnectionWebSocketEvent = {
      eventType: 'DISCONNECTION',
      companyId: companyId ?? -999,
      userId: userId ?? -999,
      orderReceivingTopicName: topicName ?? '-99999',
    };
    socketClient.send(
      '/app/disconnect', // Backend endpoint to send the event to
      {}, // Optional headers
      JSON.stringify(event) // The message payload
    );
  }
}
