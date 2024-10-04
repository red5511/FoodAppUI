import { Component } from '@angular/core';
import { TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';

@Component({
  selector: 'app-new-order-table',
  templateUrl: './new-order-table.component.html',
  styleUrls: ['./new-order-table.component.scss'] // Fix typo, should be "styleUrls"
})
export class NewOrderTableComponent {
  expandedRows: { [s: string]: boolean } = {};

  // Sample data
  orders = [
    { id: 1, name: 'Order 1', amount: 100, date: '2024-09-01', description: 'Payment for Service A', status: 'INSTOCK' },
    { id: 2, name: 'Order 2', amount: 200, date: '2024-09-05', description: 'Payment for Service B', status: 'LOWSTOCK' },
    { id: 3, name: 'Order 3', amount: 150, date: '2024-09-10', description: 'Payment for Service C', status: 'OUTOFSTOCK' }
  ];

  onRowExpand(event: TableRowExpandEvent) {
    const order = event.data;
    this.expandedRows[order.id] = true;
  }

  onRowCollapse(event: TableRowCollapseEvent) {
    const order = event.data;
    delete this.expandedRows[order.id];
  }

  expandAll() {
    this.orders.forEach(order => this.expandedRows[order.id] = true);
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
