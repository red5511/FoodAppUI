import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {
  OrderHandledInfo,
  WebSocketEventHandler,
} from '../../../services/websocket/web-socket-event-handler';
import { OrderDto } from '../../../services/models';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toast-websocket',
  templateUrl: './toast-websocket.component.html',
  styleUrl: './toast-websocket.component.scss',
})
export class ToastWebsocketComponent {
  audioContext!: AudioContext;
  // private newOrderSubscription!: Subscription;
  private newOrderProcessedSubscription!: Subscription;

  constructor(
    private toastService: ToastrService,
    private webSocketEventHandler: WebSocketEventHandler,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.requestUserInteraction(); // Set up the user interaction for audio
    console.log('ngOnInit TOAST_WEBSOCKET');
    // this.newOrderSubscription =
    //   this.webSocketEventHandler.newOrDeadlinePassedSubjectVisibility$.subscribe(
    //     (result: OrderHandledInfo) => {
    //       console.log('no otrzymalkem ' + result.id);
    //       this.handleNewOrder(result.id!);
    //     }
    //   );
    this.newOrderProcessedSubscription =
      this.webSocketEventHandler.orderProcessedVisibility$.subscribe(
        (result: OrderHandledInfo) => {
          if (result.apporvalDeadlinePassed) {
            this.handleApporvalDeadlinePassed(result.orderId!);
          } else if (result.isNewOrder) {
            this.handleNewOrder(result.orderId!);
          } else if (result.gotApproved) {
            this.onApprovedOrder(result.orderId);
          } else if (result.gotApproved === false) {
            this.onRejectedOrder(result.orderId);
          }
        }
      );
  }

  ngOnDestroy(): void {
    // if (this.newOrderSubscription) {
    //   this.newOrderSubscription.unsubscribe();
    // }
    if (this.newOrderProcessedSubscription) {
      this.newOrderProcessedSubscription.unsubscribe();
    }
  }

  onApprovedOrder(orderId: number) {
    this.toastService.success('Zamówienie zostało przyjęte #' + orderId);
  }
  onRejectedOrder(orderId: number) {
    this.toastService.warning('Zamówienie zostało odrzucone #' + orderId);
  }

  handleNewOrder(orderId: number) {
    // this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Otrzymałeś nowe zamówienie #' + orderId });
    // this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Message Content' });
    // this.messageService.add({ severity: 'success', summary: 'Warn', detail: 'Message Content' });
    this.toastService.info('Otrzymałeś nowe zamówienie #' + orderId);
  }

  handleApporvalDeadlinePassed(orderId: number) {
    this.toastService.warning(
      'Czas na akceptacjie zamówienia #' + orderId + ' minął'
    );
  }

  playSound(): void {
    const audio = new Audio();
    audio.src = 'sounds/newOrder.mp3'; // Correct path to your audio file
    audio.load();
    audio.play();
  }

  requestUserInteraction() {
    document.addEventListener(
      'click',
      () => {
        if (!this.audioContext) {
          this.audioContext = new (window.AudioContext ||
            (window as any).webkitAudioContext)();
        }
      },
      { once: true }
    ); // Listen for a single mouse movement only
  }
}
