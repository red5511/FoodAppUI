import { Component } from '@angular/core';
import { TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { DashboardService } from '../../services/services';
import { ContextService } from '../../services/context/context.service';
import { GetActiveOrders$Params } from '../../services/fn/dashboard/get-active-orders';
import { DashboardGetOrdersResponse, OrderDto } from '../../services/models';
import { filter, Subject, switchMap, takeUntil } from 'rxjs';
import { WebSocketEventHandler } from '../../services/websocket/web-socket-event-handler';

@Component({
  selector: 'app-new-order-table',
  templateUrl: './new-order-table.component.html',
  styleUrls: ['./new-order-table.component.scss'], // Fix typo, should be "styleUrls"
})
export class NewOrderTableComponent {
  expandedRows: { [s: string]: boolean } = {};
  translations: { [key: string]: string } = {
    WAITING_FOR_ACCEPTANCE: 'W akceptacji',
    IN_EXECUTION: 'W realizacji',
    EXECUTED: 'Wykonane',
    REJECTED: 'Odrzucone',
  };
  // Sample data
  orders: OrderDto[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private dashboardService: DashboardService,
    private contextService: ContextService,
    private webSocketEventHandler: WebSocketEventHandler
  ) {}

  ngOnInit(): void {
    this.contextService
      .getCompanyIdObservable()
      .pipe(
        filter((companyId): companyId is number => !!companyId),
        switchMap((companyId) => {
          const params: GetActiveOrders$Params = { companyId };
          return this.dashboardService.getActiveOrders(params);
        }),
        filter(
          (response): response is DashboardGetOrdersResponse =>
            !!response?.orderList
        ),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (response) => {
          console.log('na inicie pobranie');
          this.orders = response.orderList ?? [];
          this.expandAll();
        },
        error: (error) => {
          console.error('Error loading orders:', error);
        },
      });

    this.webSocketEventHandler.newOrderApprovedVisibility$.subscribe((val) => {
      let companyId = this.contextService.getCompanyId();
        const params: GetActiveOrders$Params = { companyId: companyId ?? -999 };
        this.dashboardService.getActiveOrders(params).subscribe({
          next: (response: DashboardGetOrdersResponse) => {
            if (response && response.orderList) {
              this.orders = response.orderList;
              this.expandAll();
            }
          },
        });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onRowExpand(event: TableRowExpandEvent) {
    const order = event.data;
    this.expandedRows[order.id] = true;
  }

  onRowCollapse(event: TableRowCollapseEvent) {
    const order = event.data;
    delete this.expandedRows[order.id];
  }

  expandAll() {
    this.orders.forEach((order) => (this.expandedRows[order.id!] = true));
  }

  collapseAll() {
    this.expandedRows = {};
  }

  getStatusSeverity(
    status: string
  ): 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast' {
    switch (status) {
      case 'WAITING_FOR_ACCEPTANCE':
        return 'info';
      case 'IN_EXECUTION':
        return 'warning';
      case 'EXECUTED':
        return 'success';
      case 'REJECTED':
        return 'danger';
      default:
        return 'contrast';
    }
  }
}
