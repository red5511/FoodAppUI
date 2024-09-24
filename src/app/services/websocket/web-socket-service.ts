import { Injectable } from '@angular/core';
import SockJs from 'sockjs-client';
import * as Stomp from 'stompjs';
import { TokenService } from '../token/token.service';

@Injectable({
    providedIn: 'root',
})
export class WebSocketService {
    private socketClient: any = null;
    private orderSubscription: any;
    private readonly WS_URL = 'http://localhost:8080/api/v1/ws';
    private subscriptionQueue: (() => void)[] = [];  // Queue of pending subscriptions
    private isConnected = false;  // New flag to track connection status

    constructor(private tokenService: TokenService) { }

    // Connect to WebSocket if not already connected
    connect() {
        if (this.socketClient && this.socketClient.connected) {
            console.log('WebSocket already connected.');
            return;
        }

        let ws = new SockJs(this.WS_URL);
        this.socketClient = Stomp.over(ws);

        this.socketClient.connect(
            { 'Authorization': 'Bearer ' + this.tokenService.token },
            () => {
                this.isConnected = true;
                console.log('WebSocket connected.');
                this.processSubscriptionQueue();  // Process any queued subscriptions
            },
            (error: any) => {
                console.error('WebSocket connection error:', error);
            }
        );
    }

    // Disconnect from WebSocket
    disconnect() {
        if (this.socketClient && this.socketClient.connected) {
            this.socketClient.disconnect(() => {
                this.isConnected = false
                console.log('WebSocket disconnected.');
            });
        }
    }

    // Subscribe to orders, or queue if not yet connected
    subscribeToOrders(email: string, callback: (message: any) => void) {
        const subscribeFunction = () => {
            this.orderSubscription = this.socketClient.subscribe(
                `/user/${email}/order`,
                (message: any) => callback(JSON.parse(message.body))
            );
            console.log(`Subscribed to /user/${email}/order`);
        };

        if (this.isConnected) {
            subscribeFunction();
        } else {
            console.log('WebSocket not yet connected, queuing subscription.');
            this.subscriptionQueue.push(subscribeFunction);  // Queue the subscription if not connected
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
}
