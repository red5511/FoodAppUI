import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import {
  DashboardGetOrdersResponse,
  OrderDto,
  Sort,
} from '../../services/models';
import {
  calculateMinutesDifferenceCeil,
  calculateSecondsDifferenceFloor,
} from '../../common/dateUtils';
import { ImageService } from '../../services/images/Image-service';
import { OrderUtils } from '../../common/orders-utils';

@Component({
  selector: 'app-new-order-table',
  templateUrl: './new-order-table.component.html',
  styleUrls: ['./new-order-table.component.scss'], // Fix typo, should be "styleUrls"
})
export class NewOrderTableComponent {
  @Input({ required: true })
  orders: OrderDto[] = [];
  @Input({ required: true })
  isHolding: boolean = true;
  @Input({ required: true })
  expandedRows: { [s: string]: boolean } = {};
  @Output()
  onRefreshOrders = new EventEmitter<boolean>();
  translations: { [key: string]: string } = {
    WAITING_FOR_ACCEPTANCE: 'W akceptacji',
    IN_EXECUTION: 'W realizacji',
    EXECUTED: 'Wykonane',
    REJECTED: 'Odrzucone',
  };
  sorts: Sort[] | undefined;
  private intervalId: any;

  constructor(
    private cdr: ChangeDetectorRef,
    public imageService: ImageService,
    public orderUtils: OrderUtils
  ) {}

  ngOnInit(): void {
    this.refreshAtStartOfMinute();
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  refreshAtStartOfMinute() {
    const now = new Date();
    const millisecondsUntilNextMinute =
      60000 - (now.getSeconds() * 1000 + now.getMilliseconds());

    setTimeout(() => {
      this.refreshOrders();
      this.intervalId = setInterval(() => {
        this.refreshOrders();
      }, 60000);
    }, millisecondsUntilNextMinute);
  }

  refreshOrders() {
    this.cdr.detectChanges();
  }

  handleOrdersResponse(response: DashboardGetOrdersResponse) {
    this.orders = response.orderList ?? [];
    this.expandFirst();
  }

  onRowExpand(event: TableRowExpandEvent) {
    const order = event.data;
    this.collapseAll();
    this.expandedRows[order.id] = true;
  }

  onRowCollapse(event: TableRowCollapseEvent) {
    const order = event.data;
    delete this.expandedRows[order.id];
  }

  expandAll() {
    this.orders.forEach((order) => (this.expandedRows[order.id!] = true));
  }

  expandFirst() {
    if (this.orders.length > 0) {
      const firstOrder = this.orders[0];
      this.expandedRows[firstOrder.id!] = true;
    }
  }

  collapseAll() {
    this.expandedRows = {};
  }

  calcTimeDifference(dateTime: string) {
    return calculateMinutesDifferenceCeil(dateTime);
  }

  approvalTimeLeft(approvalDeadline: string) {
    return calculateSecondsDifferenceFloor(approvalDeadline!) < 1;
  }
}
