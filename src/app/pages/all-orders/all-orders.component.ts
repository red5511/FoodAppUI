import { Component } from '@angular/core';
import { ContextService } from '../../services/context/context.service';
import { GetActiveOrders$Params } from '../../services/fn/dashboard/get-active-orders';
import { OrderDto, DashboardGetOrdersResponse } from '../../services/models';
import { DashboardService } from '../../services/services';
import { WebSocketService } from '../../services/websocket/web-socket-service';
import { TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';

@Component({
  selector: 'app-all-orders',
  templateUrl: './all-orders.component.html',
  styleUrl: './all-orders.component.scss',
})
export class AllOrdersComponent {}
