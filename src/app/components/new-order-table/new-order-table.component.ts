import { Component } from '@angular/core';
import { TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { DashboardService, OrderService } from '../../services/services';
import { ContextService } from '../../services/context/context.service';
import { GetActiveOrders$Params } from '../../services/fn/dashboard/get-active-orders';
import { DashboardGetOrdersResponse, OrderDto } from '../../services/models';

@Component({
  selector: 'app-new-order-table',
  templateUrl: './new-order-table.component.html',
  styleUrls: ['./new-order-table.component.scss'] // Fix typo, should be "styleUrls"
})
export class NewOrderTableComponent {
  expandedRows: { [s: string]: boolean } = {};

  // Sample data
  orders: OrderDto[] = []; // Define orders as an array of OrderDto

  constructor(private dashboardService: DashboardService, private contextService: ContextService
  ) {

  }

  ngOnInit(): void {
    this.contextService.getCompanyIdAsync().subscribe(companyId => { // Ensure this method returns an observable
      if (companyId) {
        const params: GetActiveOrders$Params = { companyId };
        
        // Now call getActiveOrders with the companyId
        this.dashboardService.getActiveOrders(params).subscribe({
          next: (response: DashboardGetOrdersResponse) => {
            if (response && response.orderList) {
              this.orders = response.orderList;
            }
          }
        });
      } else {
        console.error('Company ID is undefined');
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
    this.orders.forEach(order => this.expandedRows[order.id!] = true);
  }

  collapseAll() {
    this.expandedRows = {};
  }

  getStatusSeverity(status: string): 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast' {
    switch (status) {
      case 'INSTOCK':
        return 'success';
      case 'LOWSTOCK':
        return 'warning';
      case 'OUTOFSTOCK':
        return 'danger';
      default:
        return 'secondary';
    }
  }
}
