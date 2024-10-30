import { Component, ViewChild } from '@angular/core';
import { Table, TableLazyLoadEvent, TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { ContextService } from '../../services/context/context.service';
import { GetActiveOrders$Params } from '../../services/fn/dashboard/get-active-orders';
import { OrderDto, DashboardGetOrdersResponse, PagedOrdersResponse, GetOrdersForCompanyRequest, Sort, Filter } from '../../services/models';
import { DashboardService, OrderService } from '../../services/services';
import { GetOrdersForCompany$Params } from '../../services/fn/order/get-orders-for-company';

@Component({
  selector: 'app-all-orders-table',
  templateUrl: './all-orders-table.component.html',
  styleUrl: './all-orders-table.component.scss'
})
export class AllOrdersTableComponent {
  filterByDate() {
    throw new Error('Method not implemented.');
  }
  expandedRows: { [s: string]: boolean } = {};
  @ViewChild('dt2') dt2!: Table; // Ensure to have a reference to the PrimeNG table component

  // Sample data
  orders: OrderDto[] = []; // Define orders as an array of OrderDto
  statuses: string[] = ['WAITING_FOR_ACCEPTANCE', 'IN_EXECUTION', 'EXECUTED', 'REJECTED'];
  loading: boolean = false; // Initialize as true when loading data
  companyIdTemp!: number
  totalRecords!: number
  selectedCustomers: boolean[] = [];
  rangeDates: any;
  selectedDate: any;

  constructor(private orderService: OrderService, private contextService: ContextService) {

  }

  ngOnInit(): void {
    // this.contextService.getCompanyIdObservable().subscribe(companyId => { // Ensure this method returns an observable
    //   if (companyId) {
    //     this.companyIdTemp = companyId
    //     this.loadOrders(companyId, 1, 10, undefined, undefined)
    //   }
    // });
  }

  loadOrders(companyId: number, page: number, size: number, filters: Array<Filter> | undefined, sorts: Array<Sort> | undefined) {
    let body: GetOrdersForCompanyRequest = {
      companyId: companyId,
      filters: filters,
      page: page,
      size: size,
      sorts: undefined
    }

    this.orderService.getOrdersForCompany({ body }).subscribe({
      next: (response: PagedOrdersResponse) => {
        if (response && response.pagedResult) {
          this.orders = response.pagedResult.orderList!;
          this.totalRecords = response.pagedResult.totalRecords!
          this.loading = false; // Set to false once data is loaded
        }
      }
    });
  }

  loadOrdersLazy(event: TableLazyLoadEvent) {
    event.filters
    //this.loading = true;
    let filters = this.createFilters(event.filters)
    this.contextService.getCompanyIdObservable().subscribe(companyId => { // Ensure this method returns an observable
      if (companyId) {
        this.companyIdTemp = companyId
        const page = Math.floor(event.first! / event.rows!); // Ensure page is calculated correctly
        this.loadOrders(this.companyIdTemp, page, event.rows!, filters, undefined)
      }
    });
    // this.loadOrders(this.companyIdTemp, event.first / event.rows, event.rows, event.sortField, event.filters)
  }

  createFilters(filters: any): Array<Filter> | undefined {
    if (filters) {
      const resultFilters: Array<Filter> = [];

      Object.keys(filters).forEach((fieldName) => {
        const filterEntry = filters[fieldName];

        // Check if the filterValue is an array (handle multiple filters per field)
        if (Array.isArray(filterEntry.value)) {
          const allValues: Array<string> = [];
          filterEntry.value.forEach((val: any) => {
            if (val) {
              allValues.push(val);
            }
          });
          resultFilters.push({
            fieldName: fieldName,
            values: allValues
          });
        } else if (filterEntry && filterEntry.value !== null && filterEntry.value !== undefined) {
          resultFilters.push({
            fieldName: fieldName,
            values: Array.of(filterEntry.value),
          });
        }
        else if (filterEntry && filterEntry[0] !== null && filterEntry[0] !== undefined) {
          const value = filterEntry[0];
          console.log(typeof value.value); // "Object"
          resultFilters.push({
            fieldName: fieldName,
            values: Array.of(value.value instanceof Date ? value.value.toISOString() : 'undefined'),
            mode: value.matchMode // Convert to ISO if it's a Date
          });
        }
      });

      return resultFilters.length > 0 ? resultFilters : undefined;
    }

    return undefined;
  }

  filterGlobal(event: Event, filterType: string): void {
    const inputElement = event.target as HTMLInputElement;
    this.dt2.filterGlobal(inputElement.value, filterType);
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



// Helper function to check if a string is in ISO date format
function isIsoDateString(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value);
}

// Helper function to convert ISO string to LocalDate string (YYYY-MM-DD)
function convertToLocalDateString(isoDateString: string): string {
  const date = new Date(isoDateString);
  return date.toISOString().split("T")[0]; // Returns only the date portion in YYYY-MM-DD format
}