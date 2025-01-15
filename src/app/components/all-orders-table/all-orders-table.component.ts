import { Component, ViewChild } from '@angular/core';
import {
  Table,
  TableLazyLoadEvent,
  TableRowCollapseEvent,
  TableRowExpandEvent,
} from 'primeng/table';
import { ContextService } from '../../services/context/context.service';
import {
  OrderDto,
  PagedOrdersResponse,
  GetOrdersForCompanyRequest,
  Sort,
  GetOrdersConfigRequest,
  GetOrdersConfigResponse,
  OrderStatusModel,
  CompanyDto,
  DateRangeModel,
} from '../../services/models';
import { OrderService } from '../../services/services';
import { from, map, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { DateResult } from '../calendar-with-dialog/calendar-with-dialog.component';

@Component({
  selector: 'app-all-orders-table',
  templateUrl: './all-orders-table.component.html',
  styleUrl: './all-orders-table.component.scss',
})
export class AllOrdersTableComponent {
  price: number | undefined;
  dateRangeOptions!: DateRangeModel[];
  selectedDateRangeValue: any;
  selectedDates: Date[] = []; // Only 2 entries

  isHolding!: boolean;
  companyOptions!: CompanyDto[];
  selectedCompanyOptions: CompanyDto[] = [];

  statusOptions!: OrderStatusModel[];
  selectedStatusOptions: OrderStatusModel[] = [];

  globalSearch: string | undefined;

  expandedRows: { [s: string]: boolean } = {};
  @ViewChild('dt2') dt2!: Table; // Ensure to have a reference to the PrimeNG table component

  // Sample data
  orders: OrderDto[] = []; // Define orders as an array of OrderDto
  statusesTranslations!: { [key: string]: string };
  statuses: OrderStatusModel[] = [];
  loading: boolean = true; // Initialize as true when loading data
  companyIdTemp: number | undefined;
  totalRecords!: number;
  selectedCustomers: boolean[] = [];
  rangeDates: any;
  selectedDate: any;
  visible = true;
  private destroy$ = new Subject<void>();
  statusSeverityMap!: {
    [key: string]:
      | 'info'
      | 'warning'
      | 'success'
      | 'danger'
      | 'contrast'
      | 'yellow'};

  sortState!: { [key: string]: string };

  page: number = 1;
  size: number = 10;
  sorts!: Array<Sort>;
  private configPromise: Promise<void> | null = null;
  constructor(
    private orderService: OrderService,
    private contextService: ContextService
  ) {
    this.setDefoultSorts()
  }

  setDefoultSorts(){
    const sort: Sort = {
      direction: 'DESC',
      field: 'createdDate'
    }
    this.sorts = [sort]
    this.sortState = {
      'createdDate': 'DESC'
    }
  }

  loadOrders() {
    let selectedCompanyIds = this.selectedCompanyOptions.map(
      (company) => company.id
    );
    let body: GetOrdersForCompanyRequest = {
      validatableCompanyId: this.companyIdTemp,
      companyIds: this.isHolding ? selectedCompanyIds : [this.companyIdTemp!],
      page: this.page,
      size: this.size,
      sorts: this.sorts,
      statuses: this.selectedStatusOptions.map((option) => option.orderStatus),
      price: this.price,
      dateFrom: this.selectedDates?.at(0)?.toLocaleDateString(),
      dateTo: this.selectedDates?.at(1)?.toLocaleDateString(),
      globalSearch: this.globalSearch,
      dateRange: this.selectedDateRangeValue?.dateRange,
    };

    this.orderService.getOrdersForCompany({ body }).subscribe({
      next: (response: PagedOrdersResponse) => {
        if (response && response.pagedResult) {
          this.orders = response.pagedResult.orderList!;
          this.totalRecords = response.pagedResult.totalRecords!;
          this.loading = false; // Set to false once data is loaded
        }
      },
    });
  }

  loadOrdersLazy(event: TableLazyLoadEvent) {
    this.loading = true;
    this.contextService
      .getCompanyIdObservable()
      .pipe(
        tap((companyId) => {
          this.companyIdTemp = companyId;
          this.isHolding = this.contextService.isHolding();
          this.companyOptions = this.contextService.getCompanies() ?? [];
        }),
        switchMap((companyId) => {
          return from(this.getConfig(companyId)).pipe(map(() => companyId));
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: () => {
          this.page = Math.floor(event.first! / event.rows!);
          this.size = event.rows!;
          this.loadOrders();
        },
        error: (error) => {
          console.error('Error fetching companyId:', error);
        },
      });
  }

  getConfig(companyId: number): Promise<void> {
    if (!this.configPromise) {
      this.configPromise = new Promise((resolve, reject) => {
        const body: GetOrdersConfigRequest = { companyId };

        this.orderService.getOrdersConfig({ body }).subscribe({
          next: (response: GetOrdersConfigResponse) => {
            this.statusOptions = response.orderStatusModels;
            this.statusSeverityMap = response.statusSeverityMap;
            this.dateRangeOptions = response.dataRangeModels;
            this.selectedDateRangeValue = structuredClone(
              response.dataRangeModels.at(0)
            );
            this.statusesTranslations = response.orderStatusModels.reduce(
              (acc: { [key: string]: string }, model) => {
                acc[model.orderStatus] = model.translatedValue;
                return acc;
              },
              {}
            );

            resolve(); // Mark the promise as resolved
          },
          error: (error) => {
            console.error('Error fetching config:', error);
            reject(error); // Mark the promise as rejected
          },
        });
      });
    }

    return this.configPromise; // Always return the same promise
  }

  ngOnDestroy(): void {
    // Signal to complete the observable pipeline
    this.destroy$.next();
    this.destroy$.complete();
  }

  filterGlobal(event: Event, filterType: string): void {
    const inputElement = event.target as HTMLInputElement;
    this.dt2.filterGlobal(inputElement.value, filterType);
  }

  onInputChange(event: Event) {
    const input = event.target as HTMLInputElement; // Cast to HTMLInputElement
    const value = input.value; // Capture full input value
    this.dt2.filterGlobal(value, 'contains'); // Trigger the filter function
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

  collapseAll() {
    this.expandedRows = {};
  }

  getStatusSeverity(
    status: string
  ):
    | 'success'
    | 'secondary'
    | 'info'
    | 'warning'
    | 'danger'
    | 'contrast'
    | 'yellow'
 {
    return this.statusSeverityMap?.[status];
  }

  onCompanyOptionChange() {}

  onDateChange(event: DateResult) {
    this.selectedDateRangeValue.dateRange = event.dateRange;
    if (event.dateFrom !== undefined && event.dateTo !== undefined) {
      this.selectedDates = [event.dateFrom, event.dateTo];
    }
    this.onFilterChange();
  }

  onFilterChange() {
    this.loadOrders();
  }

  onSortChanged({
    field,
    state,
  }: {
    field: string;
    state: 'ASC' | 'DESC' | 'NONE';
  }) {
    if (state !== 'NONE') {
      this.sorts = [
        {
          direction: state,
          field,
        },
      ];
    }
    else{
      this.setDefoultSorts()
    }
    this.loadOrders();
  }
}
