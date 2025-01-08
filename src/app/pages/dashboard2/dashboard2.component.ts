import { Component } from '@angular/core';
import { DashboardService } from '../../services/services';
import { switchMap, filter, takeUntil, merge, Subject } from 'rxjs';
import { ContextService } from '../../services/context/context.service';
import {
  DashboardGetOrdersResponse,
  GetActiveOrdersRequest,
  OrderDto,
  Sort,
} from '../../services/models';
import { WebSocketEventHandler } from '../../services/websocket/web-socket-event-handler';
import { GetActiveOrders$Params } from '../../services/fn/dashboard/get-active-orders';

@Component({
  selector: 'app-dashboard2',
  templateUrl: './dashboard2.component.html',
  styleUrl: './dashboard2.component.scss',
})
export class Dashboard2Component {
  private destroy$ = new Subject<void>();
  stateOptions: any[] = [
    { label: 'Do obsługi', value: 'TO_HANDLE' },
    { label: 'Do akceptacji', value: 'TO_WAITING_FOR_ACCEPTANCE' },
  ];
  stateOptionsValue: 'TO_HANDLE' | 'TO_WAITING_FOR_ACCEPTANCE' = 'TO_HANDLE';
  orders: OrderDto[] = [];
  expandedRows: { [s: string]: boolean } = {};

  constructor(
    private dashboardService: DashboardService,
    protected contextService: ContextService,
    private webSocketEventHandler: WebSocketEventHandler
  ) {}

  ngOnInit(): void {
    const contextObservable = this.contextService.getCompanyIdObservable().pipe(
      switchMap((companyId) => this.getActiveOrdersForCompany(companyId)),
      filter(
        (response): response is DashboardGetOrdersResponse =>
          !!response?.orderList
      ),
      takeUntil(this.destroy$)
    );

    const webSocketObservable =
      this.webSocketEventHandler.orderProcessedVisibility$.pipe(
        filter(() => this.stateOptionsValue === 'TO_WAITING_FOR_ACCEPTANCE'),
        switchMap(() =>
          this.getActiveOrdersForCompany(
            this.contextService.getCompanyId() ?? -999
          )
        ),
        takeUntil(this.destroy$)
      );

    merge(contextObservable, webSocketObservable).subscribe({
      next: (response) => this.handleOrdersResponse(response),
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getActiveOrdersForCompany(companyId: number) {
    const direction =
      this.stateOptionsValue === 'TO_WAITING_FOR_ACCEPTANCE' ? 'ASC' : 'DESC';
    const field =
      this.stateOptionsValue === 'TO_WAITING_FOR_ACCEPTANCE'
        ? 'createdDate'
        : 'deliveryTime';
    const sort: Sort = {
      direction,
      field,
    };

    const companyIds =
      companyId !== -888
        ? [companyId]
        : this.contextService.getReceivingCompaniesIds() ?? [-999];
    const body: GetActiveOrdersRequest = {
      sorts: [sort],
      isWaitingToAcceptanceSection:
        this.stateOptionsValue === 'TO_WAITING_FOR_ACCEPTANCE',
      companyIds,
    };
    const params: GetActiveOrders$Params = { body };
    return this.dashboardService.getActiveOrders(params);
  }

  onSelectButtonChange() {
    this.getActiveOrdersForCompany(
      this.contextService.getCompanyId() ?? -999
    ).subscribe({
      next: (response) => this.handleOrdersResponse(response),
    });
  }

  handleOrdersResponse(response: DashboardGetOrdersResponse) {
    this.orders = response.orderList ?? [];
    this.expandFirst()
  }

  expandFirst() {
    console.log('expandFirst')
    console.log(this.orders)
    if (this.orders.length > 0) {
      const firstOrder = this.orders[0];
      this.expandedRows = {}
      this.expandedRows[firstOrder.id!] = true;
      console.log(this.expandedRows)

    }
  }
}
