import { Component, Input } from '@angular/core';
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
import moment from 'moment';
import {
  calculateMinutesDifferenceCeil,
  calculateSecondsDifferenceFloor,
  countMinutesLeft,
} from '../../common/dateUtils';
import { interval, Subscription, timer } from 'rxjs';

@Component({
  selector: 'order-actions',
  templateUrl: 'order-actions.component.html',
  styleUrl: 'order-actions.component.scss',
})
export class OrderActionsComponent {
  @Input({ required: true })
  showReject!: boolean;
  @Input({ required: true })
  showApprove!: boolean;
  @Input({ required: true })
  showSetExecutionTime!: boolean;
  @Input({ required: true })
  showPrint!: boolean;
  @Input({ required: true })
  showReadyToPickUp!: boolean;
  @Input({ required: true })
  order!: OrderDto;
  @Input({ required: true })
  approvalTimeLeft!: boolean;
  time: Date[] | undefined;
  setTimeDialogvisible: boolean = false;
  executionTimeButtonText = 'Czas odbioru';
  deliveryDatePickedByUser: Date | undefined;
  approveButtonText: string = 'Akceptuj';
  private intervalSubscriptionInMinutes: Subscription | undefined;
  private intervalSubscriptionInSeconds: Subscription | undefined;

  trackById(product: ProductDto): number {
    return product.id!; // Unique id for each product
  }

  constructor(
    private contextService: ContextService,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    if (
      this.order.approvalDeadline !== undefined &&
      calculateMinutesDifferenceCeil(this.order.approvalDeadline!) > 0
    ) {
      if (calculateSecondsDifferenceFloor(this.order.approvalDeadline!) > 60) {
        this.refreshAtStartOfMinute();
      }
      this.updateButtonTextInMinutes();
    }
    if (this.order.executionTime !== undefined) {
      this.deliveryDatePickedByUser = new Date(this.order.executionTime);
    }
  }

  ngOnDestroy() {
    // Unsubscribe from the interval when the component is destroyed
    console.log('destroy actions');
    if (this.intervalSubscriptionInMinutes) {
      this.intervalSubscriptionInMinutes.unsubscribe();
    }
    if (this.intervalSubscriptionInSeconds) {
      this.intervalSubscriptionInSeconds.unsubscribe();
    }
  }

  refreshAtStartOfMinute() {
    const now = new Date();
    const approvalDeadline = new Date(this.order.approvalDeadline!);

    // Wyznaczenie czasu do pełnej minuty
    const millisecondsUntilNextDeadlineMinute =
      ((approvalDeadline.getTime() - now.getTime()) % 60000) + 350;

    // Ustawienie timeouta
    setTimeout(() => {
      // Kod, który ma zostać wykonany na pełnej minucie
      console.log('Wykonanie na pełnej minucie!');
      
      this.intervalSubscriptionInMinutes = interval(60000).subscribe(() => {
        console.log('Wykonywane co pełną minutę!');
        this.updateButtonTextInMinutes();
      });
      this.updateButtonTextInMinutes();
    }, millisecondsUntilNextDeadlineMinute);

    console.log(
      `Timeout wystartuje za ${millisecondsUntilNextDeadlineMinute / 1000} sekund.`
    );
  }

  updateButtonTextInMinutes() {
    const secDiff = calculateSecondsDifferenceFloor(
      this.order.approvalDeadline!
    );
    console.log('updateButtonTextInMinutes' + secDiff);
    if (secDiff <= 60) {
      console.log('secDiff' + secDiff);
      this.intervalSubscriptionInSeconds = interval(1000).subscribe(() => {
        this.updateButtonTextInSeconds();
      });
      this.approveButtonText = 'Akceptuje - ' + secDiff + 'sek';
      if (this.intervalSubscriptionInMinutes) {
        this.intervalSubscriptionInMinutes.unsubscribe();
      }
    } else {
      const minLeft = countMinutesLeft(
        calculateMinutesDifferenceCeil(this.order.approvalDeadline!)
      );
      console.log('MIN' + minLeft);
      console.log(minLeft);
      this.approveButtonText = 'Akceptuje - ' + minLeft;
    }
  }

  updateButtonTextInSeconds() {
    const secDiff = calculateSecondsDifferenceFloor(
      this.order.approvalDeadline!
    );
    console.log('secDiff' + secDiff);
    this.approveButtonText = 'Akceptuje - ' + secDiff + 'sek';
    if (!this.approvalTimeLeft && secDiff < 1) {
      this.approvalTimeLeft = true;
      if (this.intervalSubscriptionInSeconds) {
        this.intervalSubscriptionInSeconds.unsubscribe();
      }
    }
  }

  approveOrder() {
    let companyId = this.contextService.getCompanyId();
    let approveRequest: ApproveNewIncomingOrderRequest = {
      companyId: companyId ?? -999,
      orderId: this.order.id ?? -999,
    };
    this.orderService
      .approveNewIncomingOrder({ body: approveRequest })
      .subscribe({
        next: (response) => {},
      });
  }

  rejectOrder() {
    let companyId = this.contextService.getCompanyId();
    let rejectRequest: RejectNewIncomingOrderRequest = {
      companyId: companyId ?? -999,
      orderId: this.order.id ?? -999,
    };
    this.orderService
      .rejectNewIncomingOrder({ body: rejectRequest })
      .subscribe({
        next: (response) => {},
      });
  }

  onTimeSelected(time: Date) {
    this.executionTimeButtonText = time.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  setExecutionTime() {
    console.log(this.setTimeDialogvisible);
    this.setTimeDialogvisible = true;
  }

  userDeliveryIsBiggerThat1Hour() {
    if (this.deliveryDatePickedByUser !== undefined) {
      const dateToCheck = moment(this.deliveryDatePickedByUser);
      const currentDate = moment();
      return dateToCheck.isAfter(currentDate.add(1, 'hour'));
    }
    return false;
  }
}
