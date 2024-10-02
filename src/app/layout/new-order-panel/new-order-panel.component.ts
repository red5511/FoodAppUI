import { Component, Input } from '@angular/core';
import { ApproveNewIncomingOrderRequest, OrderDto, ProductDto, RejectNewIncomingOrderRequest } from '../../services/models';
import { ToastrService } from 'ngx-toastr';
import { ContextService } from '../../services/context/context.service';
import { WebSocketService } from '../../services/websocket/web-socket-service';
import { OrderService } from '../../services/services';
import { animate, animateChild, group, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-new-order-panel',
  templateUrl: './new-order-panel.component.html',
  styleUrl: './new-order-panel.component.scss',
  animations: [
    trigger(
      'inOutAnimation',
      [
        transition(':enter', [style({ opacity: 0, transform: 'translateY(-75px)' }), animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0px)' }))]),
        transition(':leave', [animate('300ms ease-out', style({ opacity: 0, transform: 'translateY(-75px)' }))]),
      ]
    ),
    trigger(
      'inOutAnimationBackground',
      [
        transition(':enter', [style({ opacity: 0 }), animate('300ms ease-out', style({ opacity: 1 }))]),
        //        transition(':leave', [animate('300ms ease-out', style({opacity: 0}))]),
        transition(':leave', group([
          animateChild(), // Ensure child animation plays
          animate('300ms ease-out', style({ opacity: 0, transform: 'translateY(10px)' }))
        ])),
      ]
    )
  ]
})
export class NewOrderPanelComponent {

  onClick() {
    console.log()
    this.isDisplay = !this.isDisplay
  }

  isDisplay = false;
  timeRemaining = 4;
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

  constructor(
    private contextService: ContextService,
    private toastService: ToastrService,
    private webSocketService: WebSocketService,
    private orderService: OrderService
  ) {
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
        if (this.orders.length == 0) {
          this.timeRemaining = this.calculateTimeLeft(order);
          console.log("TimeReaming" + this.timeRemaining)
          this.order = order;
          this.timerIntervalId = setInterval(() => this.handleTimer(), 1000)
          //this.soundIntervalId = setInterval(() => this.playSound(), 2000)
        }
        else {
          this.toastService.info("Otrzymałeś nowe zamówienie podczas akceptacji obecnego. Czas na jego akceptacje: " + this.calculateTimeLeft(order) + " sekund", order.name)
        }
        this.orders.push(order);
        this.isDisplay = true;
      }
    });
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

    const deadline = new Date(year, month, day, hours, minutes, seconds).getTime();
    const timeDifference = deadline - now; // Difference in milliseconds

    if (timeDifference > 0) {
      return Math.floor(timeDifference / 1000); // Convert to seconds
    } else {
      return 0; // Deadline has passed
    }
  }

  disconnectWebSocket() {
    this.webSocketService.disconnect()
  }

  handleTimer() {
    console.log(this.timeRemaining)

    if (this.timeRemaining <= 0) {
      this.toastService.warning("Zamówienie zostało odrzucone", this.order.name)
      this.handleProcessOrder();
    }
    else {
      this.timeRemaining = this.timeRemaining - 1
      //this.isDisplay = true
    }
  }

  playSound(): void {
    if (this.isDisplay) {
      const audio = new Audio();
      audio.src = 'sounds/newOrder.mp3';  // Correct path to your audio file
      audio.load();
      audio.play();
    }
  }

  approveOrder() {
    let companyId = this.contextService.getCompanyId();
    if (companyId !== undefined) {
      let approveRequest: ApproveNewIncomingOrderRequest = {
        companyId: companyId,
        orderId: this.order.id
      }
      this.orderService.approveNewIncomingOrder({ body: approveRequest }).subscribe({
        next: (response) => {
          this.toastService.success("Zamówienie zostało przyjęte", this.order.name)
          this.handleProcessOrder()
        }
      });
    }
  }

  rejectOrder() {
    let companyId = this.contextService.getCompanyId();
    if (companyId !== undefined) {
      let rejectRequest: RejectNewIncomingOrderRequest = {
        companyId: companyId,
        orderId: this.order.id
      }
      this.orderService.rejectNewIncomingOrder({ body: rejectRequest }).subscribe({
        next: (response) => {
          this.toastService.warning("Zamówienie zostało odrzucone", this.order.name)
          this.handleProcessOrder()
        }
      });
    }
  }

  handleProcessOrder() {
    console.log("HANDLE" + this.orders.length)
    this.isDisplay = false
    this.orders.shift();
    if (this.orders.length > 0) {
      this.order = this.orders.at(0)!
      this.timeRemaining = this.calculateTimeLeft(this.orders.at(0)!);
      setTimeout(() => this.reOpenPanelForQueuedOrders(), 600)
    }
    else {
      clearInterval(this.timerIntervalId);  // Stop the timer
      clearInterval(this.soundIntervalId);  // Stop the timer
    }
  }

  reOpenPanelForQueuedOrders(): void {
    this.isDisplay = true
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
