import { Component } from '@angular/core';
import {
  ApproveNewIncomingOrderRequest,
  OrderDto,
  ProductDto,
  RejectNewIncomingOrderRequest,
} from '../../services/models';
import { ToastrService } from 'ngx-toastr';
import { ContextService } from '../../services/context/context.service';
import {} from '../../services/websocket/socket-service';
import { OrderService } from '../../services/services';
import {
  animate,
  animateChild,
  group,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  OrderHandledInfo,
  WebSocketEventHandler,
} from '../../services/websocket/web-socket-event-handler';

@Component({
  selector: 'app-new-order-panel',
  templateUrl: './new-order-panel.component.html',
  styleUrl: './new-order-panel.component.scss',
  animations: [
    trigger('inOutAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-75px)' }),
        animate(
          '300ms ease-out',
          style({ opacity: 1, transform: 'translateY(0px)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '300ms ease-out',
          style({ opacity: 0, transform: 'translateY(-75px)' })
        ),
      ]),
    ]),
    trigger('inOutAnimationBackground', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 })),
      ]),
      //        transition(':leave', [animate('300ms ease-out', style({opacity: 0}))]),
      transition(
        ':leave',
        group([
          animateChild(), // Ensure child animation plays
          animate(
            '300ms ease-out',
            style({ opacity: 0, transform: 'translateY(10px)' })
          ),
        ])
      ),
    ]),
  ],
})
export class NewOrderPanelComponent {
  areButtonsDisabled = true;
  isDisplay = false;
  timeRemaining = 4;
  timerIntervalId: any;
  soundIntervalId: any;
  audioContext!: AudioContext;
  socketClient: any = null;
  orders: OrderDto[] = [];
  order!: OrderDto;
  userEmail: string | undefined;
  alreadyProcessed: boolean = false;
  // socket odbiera eventa ze ze zamowienie zostalo obsluzone, potrzebne przy multilogowaniu

  trackById(product: ProductDto): number {
    return product.id!; // Unique id for each product
  }

  constructor(
    private contextService: ContextService,
    private toastService: ToastrService,
    private webSocketEventHandler: WebSocketEventHandler,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    this.requestUserInteraction(); // Set up the user interaction for audio
    this.webSocketEventHandler.newOrderSubjectVisibility$.subscribe(
      (newOrder: OrderDto) => {
        this.handleNewOrder(newOrder);
      }
    );
    this.webSocketEventHandler.newOrderHandledByOtherUserVisibility$.subscribe(
      (result: OrderHandledInfo) => {
        if (this.order?.id == result.orderId) {
          if (result.gotAccepted) {
            this.onApprovedOrder();
          } else {
            this.onRejectedOrder();
          }
          this.alreadyProcessed = true
        }
      }
    );
  }

  handleNewOrder(newOrder: OrderDto) {
    this.alreadyProcessed = false;
    if (this.orders.length == 0) {
      this.timeRemaining = this.calculateTimeLeft(newOrder);
      this.order = newOrder;
      this.timerIntervalId = setInterval(() => this.handleTimer(), 1000);
      //this.soundIntervalId = setInterval(() => this.playSound(), 2000)
      this.isDisplay = true;
      setTimeout(() => (this.areButtonsDisabled = false), 1100);
    } else {
      this.toastService.info(
        'Otrzymałeś nowe zamówienie podczas akceptacji obecnego. Czas na jego akceptacje: ' +
          this.calculateTimeLeft(newOrder) +
          ' sekund',
        '#' + newOrder.id
      );
    }
    this.orders.push(newOrder);
  }

  calculateTimeLeft(order: OrderDto): number {
    const now = new Date().getTime(); // Current time in milliseconds
    const deadlineArray = order.approvalDeadline!;

    const year = Number(deadlineArray[0]); // Convert to number
    const month = Number(deadlineArray[1]) - 1; // Convert to number (0-based index)
    const day = Number(deadlineArray[2]); // Convert to number
    const hours = Number(deadlineArray[3]); // Convert to number
    const minutes = Number(deadlineArray[4]); // Convert to number
    const seconds = Number(deadlineArray[5]); // Convert to number

    const deadline = new Date(
      year,
      month,
      day,
      hours,
      minutes,
      seconds
    ).getTime();
    const timeDifference = deadline - now; // Difference in milliseconds

    if (timeDifference > 0) {
      return Math.floor(timeDifference / 1000); // Convert to seconds
    } else {
      return 0; // Deadline has passed
    }
  }

  handleTimer() {
    if (this.timeRemaining <= 0) {
      this.toastService.warning(
        'Zamówienie zostało odrzucone',
        '#' + this.order.id
      );
      this.handleProcessOrder();
    } else {
      this.timeRemaining = this.timeRemaining - 1;
    }
  }

  playSound(): void {
    if (this.isDisplay) {
      const audio = new Audio();
      audio.src = 'sounds/newOrder.mp3'; // Correct path to your audio file
      audio.load();
      audio.play();
    }
  }

  approveOrder() {
    let companyId = this.contextService.getCompanyId();
    let topicName = this.contextService.getMainWebSocketTopicName();
    let approveRequest: ApproveNewIncomingOrderRequest = {
      companyId: companyId ?? -999,
      orderId: this.order.id ?? -999,
      orderReceivingTopicName: topicName ?? '-999',
    };
    this.orderService
      .approveNewIncomingOrder({ body: approveRequest })
      .subscribe({
        next: (response) => {
          console.log('PRZEZ HTTP SE LECE');
          this.onApprovedOrder();
          this.alreadyProcessed = true
        },
      });
  }
  onApprovedOrder() {
    if (this.alreadyProcessed) {
      return;
    }
    this.handleProcessOrder();
    this.toastService.success(
      'Zamówienie zostało przyjęte',
      '#' + this.order.id
    );
    this.webSocketEventHandler.fireNewOrderApproved();
  }
  onRejectedOrder() {
    if (this.alreadyProcessed) {
      return;
    }
    this.handleProcessOrder();
    this.toastService.warning(
      'Zamówienie zostało odrzucone',
      '#' + this.order.id
    );
  }

  rejectOrder() {
    let companyId = this.contextService.getCompanyId();
    let topicName = this.contextService.getMainWebSocketTopicName();
    let rejectRequest: RejectNewIncomingOrderRequest = {
      companyId: companyId ?? -999,
      orderId: this.order.id ?? -999,
      orderReceivingTopicName: topicName ?? '-999',
    };
    this.orderService
      .rejectNewIncomingOrder({ body: rejectRequest })
      .subscribe({
        next: (response) => {
          this.onRejectedOrder();
          this.alreadyProcessed = true;
        },
      });
  }

  handleProcessOrder() {
    this.isDisplay = false;
    this.areButtonsDisabled = true;
    this.orders.shift();
    if (this.orders.length > 0) {
      this.order = this.orders.at(0)!;
      this.timeRemaining = this.calculateTimeLeft(this.orders.at(0)!);
      setTimeout(() => this.reOpenPanelForQueuedOrders(), 600);
      setTimeout(() => (this.areButtonsDisabled = false), 1100);
    } else {
      clearInterval(this.timerIntervalId); // Stop the timer
      clearInterval(this.soundIntervalId); // Stop the timer
    }
  }

  reOpenPanelForQueuedOrders(): void {
    this.isDisplay = true;
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
