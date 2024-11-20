import { Component } from '@angular/core';
import { TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { DashboardService, OrderService } from '../../services/services';
import { ContextService } from '../../services/context/context.service';
import { GetActiveOrders$Params } from '../../services/fn/dashboard/get-active-orders';
import { DashboardGetOrdersResponse, OrderDto } from '../../services/models';
import { WebSocketService } from '../../services/websocket/web-socket-service';

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
  orders: OrderDto[] = []; // Define orders as an array of OrderDto

  constructor(
    private dashboardService: DashboardService,
    private contextService: ContextService,
    private webSocketService: WebSocketService,
  ) {}

  ngOnInit(): void {
    this.contextService.getCompanyIdObservable().subscribe((companyId) => {
      // Ensure this method returns an observable
      if (companyId) {
        const params: GetActiveOrders$Params = { companyId };

        // Now call getActiveOrders with the companyId
        this.dashboardService.getActiveOrders(params).subscribe({
          next: (response: DashboardGetOrdersResponse) => {
            if (response && response.orderList) {
              this.orders = response.orderList;
              this.expandAll();
            }
          },
        });
      }
    });

    this.webSocketService.newOrderApprovedVisibility$.subscribe((val) => {
      let companyId = this.contextService.getCompanyId();
      if (companyId !== undefined) {
        const params: GetActiveOrders$Params = { companyId };

        // Now call getActiveOrders with the companyId
        this.dashboardService.getActiveOrders(params).subscribe({
          next: (response: DashboardGetOrdersResponse) => {
            if (response && response.orderList) {
              this.orders = response.orderList;
              this.expandAll();
            }
          },
        });
      }
    });
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
    status: string,
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
