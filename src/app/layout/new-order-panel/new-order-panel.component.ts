import { Component, Input } from '@angular/core';
import { OrderDto, ProductDto } from '../../services/models';
import { ToastrService } from 'ngx-toastr';
import { ContextService } from '../../services/context/context.service';
import { WebSocketService } from '../../services/websocket/web-socket-service';

@Component({
  selector: 'app-new-order-panel',
  templateUrl: './new-order-panel.component.html',
  styleUrl: './new-order-panel.component.scss'
})
export class NewOrderPanelComponent {
  isDisplay = false;
  timeRemaining = 14;
  timerIntervalId: any
  soundIntervalId: any
  audioContext!: AudioContext;
  userEmail: string = 'maciekfranczak@onet.eu';
  socketClient: any = null;
  orders: OrderDto[] = [];
  order!: OrderDto;

  trackById(index: number, product: ProductDto): number {
    return product.id!; // Unique id for each product
  }

  constructor(private contextService: ContextService, private toastService: ToastrService, private webSocketService: WebSocketService) {
  }

  ngOnInit() {
    this.requestUserInteraction(); // Set up the user interaction for audio
    this.initWebsocket()
  }

  initWebsocket() {
    this.contextService.contextSubjectVisibility$.subscribe((context) => {
      console.log("Wykrylem context change and trying to websocket stuff")
      console.log(context)

      if (context?.isUserReceivingOrdersActive) {
        this.connectWebSocket();
      } else {
        this.disconnectWebSocket();
      }
    });
  }

  connectWebSocket() {
    this.webSocketService.connect();

    // Subscribe to the WebSocket orders channel
    this.webSocketService.subscribeToOrders(this.userEmail, (order: OrderDto) => {
      if (order) {
        this.toastService.info(order.customerName, order.description);
        this.orders.push(order);
        this.order = order;
        this.isDisplay = true;
        this.timeRemaining = 14;
        this.timerIntervalId = setInterval(() => this.handleTimer(), 1000)
        this.soundIntervalId = setInterval(() => this.playSound(), 2000)
      }
    });
  }

  disconnectWebSocket() {
    this.webSocketService.disconnect()
  }

  handleTimer() {
    console.log(this.timeRemaining)

    if (this.timeRemaining == 0) {
      this.isDisplay = false
      this.toastService.error("Zamówienie nie zostało przyjete", "xd")
      clearInterval(this.timerIntervalId);  // Stop the timer
      clearInterval(this.soundIntervalId);  // Stop the timer
    }
    this.timeRemaining = this.timeRemaining - 1
  }

  playSound(): void {
    if (this.isDisplay) {
      const audio = new Audio();
      audio.src = 'sounds/newOrder.mp3';  // Correct path to your audio file
      audio.load();
      audio.play();
    }
  }

  requestUserInteraction() {
    document.addEventListener('click', () => {
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        console.log("AudioContext created on mouse move.");
      }
    }, { once: true }); // Listen for a single mouse movement only
  }
}
