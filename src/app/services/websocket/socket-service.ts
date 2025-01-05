import { Injectable } from '@angular/core';
import SockJs from 'sockjs-client';
import * as Stomp from 'stompjs';
import { TokenService } from '../token/token.service';
import { ContextService } from '../context/context.service';
import { WebSocketEvent } from '../models';
import { WebSocketEventHandler } from './web-socket-event-handler';
import { Subject } from 'rxjs';
import { Client, Subscription } from 'stompjs';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private readonly WS_URL = 'http://localhost:8080/api/v1/ws';
  public MAIN_TOPIC!: string;
  public socketClient!: Client;
  public isConnected = false; // New flag to track connection status
  private subscriptionQueue: (() => void)[] = []; // Queue of pending subscriptions
  private heartbeatIntervalId: any; // Queue of pending subscriptions
  private subscriptions: Map<string, Subscription> = new Map(); // To store subscriptions
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
          let topicsToAdd = this.contextService
            .getReceivingCompaniesTopicNames()
            ?.filter((topic) => !this.subscriptions.has(topic));

          let topicsToRemove = [...this.subscriptions.keys()].filter(
            (topic) =>
              !this.contextService
                .getReceivingCompaniesTopicNames()
                ?.includes(topic)
          );
          console.log('socket stuf');
          console.log(this.contextService.getReceivingCompaniesTopicNames());
          console.log(this.subscriptions.keys());
          console.log(topicsToAdd ?? []);
          console.log(topicsToRemove);
          this.subscribeToTopics(topicsToAdd ?? []);
          this.unsubscribeFromTopics(topicsToRemove);
        } else {
          console.log('kek w dc');
          this.unsubscribeFromTopics([...this.subscriptions.keys()]);
          this.processDisconnection();
        }
      }
    );
  }

  subscribeToTopics(topicsToAdd: string[]) {
    console.log('subscribeToTopics');

    console.log(topicsToAdd);
    if (topicsToAdd && topicsToAdd.length > 0) {
      topicsToAdd.forEach((topicName) => {
        const companyTopic = `/user/${topicName}/main`; // Construct the topic name
        this.subscribeToComapnyTopic(
          companyTopic,
          (event: WebSocketEvent) => {
            console.log('Subscribed to:', companyTopic);
            this.eventHandler.handleEvent(event); // Handle the event for each topic
          }
        );
      });
    } else {
      console.warn('No topics to connect to');
    }
  }

  unsubscribeFromTopics(topics: string[]): void {
    console.log('unsubscribeFromTopics')
    topics.forEach((topicName) => {
      const subscription = this.subscriptions.get(topicName);
      console.log(this.subscriptions)
      console.log(subscription)

      if (subscription) {
        subscription.unsubscribe(); // Unsubscribe using the WebSocket library's method
        this.subscriptions.delete(topicName); // Remove from the map
        console.log('Unsubscribed from:', topicName);
      } else {
        console.log('No subscription found for:', topicName);
      }
    });
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
          this.MAIN_TOPIC, //hmmmm usseles zmienna trzeba zmienic zeby bylka ta uzywana w funkcji
          this.socketClient
        ),
      60000
    );

    const windowCount = Number(
      localStorage.getItem('activeSocketWindowCount') || 0
    );
    localStorage.setItem(
      'activeSocketWindowCount',
      (windowCount + 1).toString()
    );
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
    const windowCount = Number(
      localStorage.getItem('activeSocketWindowCount') || 0
    );
    const updatedCount = Math.max(windowCount - 1, 0);
    localStorage.setItem('activeSocketWindowCount', updatedCount.toString());
  }

  // Subscribe to orders, or queue if not yet connected
  subscribeToComapnyTopic(topicName: string, callback: (message: any) => void) {
    const subscribeFunction = () => {
      let subscription = this.socketClient.subscribe(
        topicName,
        (message: any) => callback(JSON.parse(message.body))
      );
      console.log(`Subscribed to /user/${topicName}/order`);
      this.subscriptions.set(topicName, subscription);
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

  processDisconnection() {
    if (this.isConnected) {
      this.eventHandler.sendDisconnectionEvent(this.socketClient);
      this.disconnect();
    }
  }
}
