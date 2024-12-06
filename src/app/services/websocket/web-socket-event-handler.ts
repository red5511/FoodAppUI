import { Injectable } from '@angular/core';
import {
  ApprovedOrderWebSocketEvent,
  DisconnectionWebSocketEvent,
  HeartbeatWebSocketEvent,
  NewOrderWebSocketEvent,
  OrderDto,
  ServerSideDisconnectionWebSocketEvent,
  WebSocketEvent,
} from '../models';
import { BehaviorSubject, Subject } from 'rxjs';
import { ContextService } from '../context/context.service';

export interface OrderHandledInfo {
  orderId: number;
  gotAccepted: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class WebSocketEventHandler {
   // sluzy to poinformowania reszty ze order zostal zaakceptowany/odrzucony
  private newOrderAprovedSubject = new Subject<boolean>();
  newOrderApprovedVisibility$ = this.newOrderAprovedSubject.asObservable();

   // sluzy to poinformowania reszty ze przyszedl nowy order i mozna go zaakceptowac/odrzucic
  private newOrderSubject = new Subject<OrderDto>();
  newOrderSubjectVisibility$ = this.newOrderSubject.asObservable();

     // sluzy to poinformowania reszty ze nowy order ktory przyszedl zostal zaakceptowany/odrzucony przez innego usera
  private newOrderHandledByOtherUser = new Subject<OrderHandledInfo>()
  newOrderHandledByOtherUserVisibility$ = this.newOrderHandledByOtherUser.asObservable()


  constructor(private contextService: ContextService) {}

  handleEvent(event: WebSocketEvent) {
    if (event) {
      if (event.eventType === 'NEW_ORDER') {
        this.handleNewOrderEvent(event as NewOrderWebSocketEvent);
      } else if (event.eventType === 'SERVER_SIDE_DISCONNECTION') {
        this.handleServerSideDisconnectionEvent(event as ServerSideDisconnectionWebSocketEvent
        );
      } else if (event.eventType === 'APPROVED_ORDER') {
        this.handleApprovedOrderWebSocketEvent(event as ApprovedOrderWebSocketEvent
        );
      } else if (event.eventType === 'REJECTED_ORDER') {
        this.handleRejectedOrderWebSocketEvent(event as ApprovedOrderWebSocketEvent
        );
      }
    }
  }

  handleApprovedOrderWebSocketEvent(event: ApprovedOrderWebSocketEvent) {
    this.newOrderHandledByOtherUser.next({
      orderId: event.orderId,
      gotAccepted: true
    })
  }  

  handleRejectedOrderWebSocketEvent(event: ApprovedOrderWebSocketEvent) {
    this.newOrderHandledByOtherUser.next({
      orderId: event.orderId,
      gotAccepted: false
    })
  }

  handleServerSideDisconnectionEvent(event: ServerSideDisconnectionWebSocketEvent) {
    if (this.contextService.getUserId() === event.userId){
      this.contextService.setUserReceivingOrdersActive(false)
    }
  }

  handleNewOrderEvent(event: NewOrderWebSocketEvent) {
    const order = event.order;
    if (order) {
      this.newOrderSubject.next(order);
    } else {
      console.error(
        'no niby otrzymalem new ordera z socketa ale nie wszed w ifa'
      );
    }
  }

  sendHeartbeatEvent(destination: string, socketClient: any) {
    const companyId = this.contextService.getCompanyId();
    const userId = this.contextService.getUserId();
    const event: HeartbeatWebSocketEvent = {
      eventType: 'HEARTBEAT',
      companyId: companyId ?? -999,
      userId: userId ?? -999,
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

  fireNewOrderApproved() {
    this.newOrderAprovedSubject.next(true);
  }
}
