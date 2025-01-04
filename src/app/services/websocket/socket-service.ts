import { Injectable } from '@angular/core';
import SockJs from 'sockjs-client';
import * as Stomp from 'stompjs';
import { TokenService } from '../token/token.service';
import { ContextService } from '../context/context.service';
import { WebSocketEvent } from '../models';
import { WebSocketEventHandler } from './web-socket-event-handler';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private readonly WS_URL = 'http://localhost:8080/api/v1/ws';
  public MAIN_TOPIC!: string;
  public socketClient: any = null;
  public isConnected = false; // New flag to track connection status
  private orderSubscription: any;
  private subscriptionQueue: (() => void)[] = []; // Queue of pending subscriptions
  private heartbeatIntervalId: any; // Queue of pending subscriptions
  private forcedConnectionChangeSubject = new Subject<boolean>();
  forcedConnectionChangeSubjectVisiblity$ =
    this.forcedConnectionChangeSubject.asObservable();

  constructor(
    private tokenService: TokenService,
    private contextService: ContextService,
    private eventHandler: WebSocketEventHandler
  ) {
    this.contextService.userReceivingOrdersSubjectVisibility$.subscribe(
      (isReceiving) => {
        if (isReceiving) {
          this.connect();
          this.connectToMainTopic();
        } else {
          this.processDisconnection()
        }
      }
    );
  }

  connectToMainTopic() {
    console.log('connectToMainTopic')
    let topicName = this.contextService.getMainWebSocketTopicName();
    if (topicName !== undefined) {
      (this.MAIN_TOPIC = `/user/${topicName}/main`),
        this.subscribeToMainTopic(this.MAIN_TOPIC, (event: WebSocketEvent) => {
          this.eventHandler.handleEvent(event);
        });
    }
  }

  // Connect to WebSocket if not already connected
  connect() {
    if (this.socketClient && this.socketClient.connected) {
      console.log('WebSocket already connected.');
      return;
    }

    let ws = new SockJs(this.WS_URL);
    this.socketClient = Stomp.over(ws);

    this.socketClient.connect(
      { Authorization: 'Bearer ' + this.tokenService.token },
      () => {
        this.isConnected = true;
        console.log('WebSocket connected.');
        this.processSubscriptionQueue(); // Process any queued subscriptions
      },
      (error: any) => {
        console.error('WebSocket connection error:', error);
      }
    );

    this.heartbeatIntervalId = setInterval(
      () =>
        this.eventHandler.sendHeartbeatEvent(
          this.MAIN_TOPIC,
          this.socketClient
        ),
      60000
    );

    const windowCount = Number(localStorage.getItem('activeSocketWindowCount') || 0);
    localStorage.setItem('activeSocketWindowCount', (windowCount + 1).toString());
  }

  // Disconnect from WebSocket
  disconnect() {
    this.forcedConnectionChangeSubject.next(false);
    clearInterval(this.heartbeatIntervalId);
    if (this.socketClient && this.socketClient.connected) {
      this.socketClient.disconnect(() => {
        this.isConnected = false;
        console.log('WebSocket disconnected.');
      });
    }
    const windowCount = Number(localStorage.getItem('activeSocketWindowCount') || 0);
    const updatedCount = Math.max(windowCount - 1, 0);
    localStorage.setItem('activeSocketWindowCount', updatedCount.toString());
  }

  // Subscribe to orders, or queue if not yet connected
  subscribeToMainTopic(topicName: string, callback: (message: any) => void) {
    const subscribeFunction = () => {
      this.orderSubscription = this.socketClient.subscribe(
        this.MAIN_TOPIC,
        (message: any) => callback(JSON.parse(message.body))
      );
      console.log(`Subscribed to /user/${topicName}/order`);
    };

    if (this.isConnected) {
      subscribeFunction();
    } else {
      console.log('WebSocket not yet connected, queuing subscription.');
      this.subscriptionQueue.push(subscribeFunction); // Queue the subscription if not connected
    }
  }

  private processSubscriptionQueue() {
    while (this.subscriptionQueue.length > 0) {
      const subscribe = this.subscriptionQueue.shift();
      if (subscribe) {
        subscribe();
      }
    }
  }

  // Unsubscribe from orders
  unsubscribeFromOrders() {
    if (this.orderSubscription) {
      this.orderSubscription.unsubscribe();
      this.orderSubscription = null;
    }
  }

  processDisconnection() {
    if (this.isConnected) {
      this.eventHandler.sendDisconnectionEvent(this.socketClient);
      this.disconnect();
    }
  }
}
