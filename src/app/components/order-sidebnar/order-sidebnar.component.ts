import { Component } from '@angular/core';
import SockJs from 'sockjs-client';
import * as Stomp from 'stompjs';
import { TokenService } from '../../services/token/token.service';
import { ToastrService } from 'ngx-toastr';
import { OrderDto } from '../../services/models';
import { WebSocketService } from '../../services/websocket/web-socket-service';
import { ContextService } from '../../services/context/context.service';

@Component({
  selector: 'app-order-sidebnar',
  templateUrl: './order-sidebnar.component.html',
  styleUrl: './order-sidebnar.component.scss'
})
export class OrderSidebnarComponent {
  socketClient: any = null;
  isOrderSidebarVisable: boolean = false;
  userEmail: string = 'maciekfranczak@onet.eu';
  private orderSubscription: any;
  orders: OrderDto[] = [];

  constructor(private contextService: ContextService, private toastService: ToastrService, private webSocketService: WebSocketService) {
  }

  ngOnInit() {
    this.contextService.contextSubjectVisibility$.subscribe((context) => {
      if (context?.isUserReceivingOrdersActive) {
        this.initWebSocket();
      } else {
        this.disconnectWebSocket();
      }
    });
  }

  initWebSocket() {
    this.webSocketService.connect();

    // Subscribe to the WebSocket orders channel
    this.webSocketService.subscribeToOrders(this.userEmail, (order: OrderDto) => {
      if (order) {
        this.toastService.info(order.customerName, order.description);
        this.orders.push(order);
        this.isOrderSidebarVisable = true;
      }
    });
  }

  disconnectWebSocket() {
    this.webSocketService.disconnect()
  }

}
