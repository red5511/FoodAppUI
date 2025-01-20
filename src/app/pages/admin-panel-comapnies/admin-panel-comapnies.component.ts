import { Component } from '@angular/core';
import {
  CompanyDto,
  GetCompanyAdministrationRequest,
  Sort,
} from '../../services/models';
import {
  TableLazyLoadEvent,
  TableRowCollapseEvent,
  TableRowExpandEvent,
} from 'primeng/table';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { CompanyAdministrationService } from '../../services/services';

@Component({
  selector: 'app-admin-panel-comapnies',
  templateUrl: './admin-panel-comapnies.component.html',
  styleUrl: './admin-panel-comapnies.component.scss',
})
export class AdminPanelComapniesComponent {
  companies: CompanyDto[] = [];
  loading: boolean = true;
  totalRecords!: number;
  expandedRows: { [s: string]: boolean } = {};
  selectedDates: Date[] = []; // Only 2 entries
  globalSearch: string | undefined;
  sorts!: Array<Sort>;
  sortState: { [key: string]: string } = {};
  page: number = 1;
  size: number = 10;

  private searchSubject = new Subject<string>();
  private searchCompanySubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private companyAdministrationService: CompanyAdministrationService
  ) {
    this.setDefoultSorts();
  }

  ngOnInit(): void {
    this.searchSubject
      .pipe(
        debounceTime(400), // Delay of 300ms
        takeUntil(this.destroy$) // Automatically unsubscribes on destroy
      )
      .subscribe((searchTerm) => {
        this.onFilterChange(searchTerm);
      });

    this.searchCompanySubject
      .pipe(
        debounceTime(400), // Delay of 300ms
        takeUntil(this.destroy$) // Automatically unsubscribes on destroy
      )
      .subscribe((searchTerm) => {
        this.onUserSearch(searchTerm);
      });
  }

  loadComapniesLazy(event: TableLazyLoadEvent) {
    this.loading = true;
    this.page = Math.floor(event.first! / event.rows!);
    this.size = event.rows!;
    this.loadCompanies();
  }

  onRowExpand(event: TableRowExpandEvent) {
    const order = event.data;
    this.collapseAll();
    this.expandedRows[order.id] = true;
  }

  onRowCollapse(event: TableRowCollapseEvent) {
    const user = event.data;
    delete this.expandedRows[user.id];
  }

  collapseAll() {
    this.expandedRows = {};
  }

  onCalendarSelect() {
    this.loadCompanies();
  }

  loadCompanies() {
    const body: GetCompanyAdministrationRequest = {
      globalSearch: this.globalSearch,
      page: 0,
      size: 100,
      sorts: this.sorts,
    };
    this.companyAdministrationService.getPagedCompanies({ body }).subscribe({
      next: (response) => {
        if (response.pagedResult?.companies) {
          this.loading = false;
          this.companies = response.pagedResult.companies;
        }
      },
    });
  }

  onInputChange(value: string): void {
    this.searchSubject.next(value); // Pass the input value to the Subject
  }

  onFilterChange(searchTerm: string) {
    this.globalSearch = searchTerm;
    console.log('onFilterChange');
    this.loading = true;
    this.loadCompanies();
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
    } else {
      this.setDefoultSorts();
    }
    this.loadCompanies();
  }

  setDefoultSorts() {
    const sort: Sort = {
      direction: 'DESC',
      field: 'createdDate',
    };
    this.sorts = [sort];
    this.sortState = {
      createdDate: 'DESC',
    };
  }

  onUserSearch(searchInput: string) {}
}
