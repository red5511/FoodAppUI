import { Component } from '@angular/core';
import {
  AddOrDeleteCompaniesUsersAdministrationRequest,
  CompanyDto,
  GetCompanyAdministrationRequest,
  GetUsersAdministrationRequest,
  Sort,
  UserDto,
} from '../../services/models';
import {
  TableLazyLoadEvent,
  TableRowCollapseEvent,
  TableRowExpandEvent,
} from 'primeng/table';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import { CompanyAdministrationService, UserAdministrationService } from '../../services/services';
import { ToastrService } from 'ngx-toastr';

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
  globalUserSearch = '';
  sorts!: Array<Sort>;
  sortState: { [key: string]: string } = {};
  page: number = 1;
  size: number = 10;
  selectedCompany!: CompanyDto
  companiesUsers: UserDto[] = [];
  users: UserDto[] = [];
  userSearchVisible = false;
  addedUserToComapny: UserDto[] = [];
  addedUserFirstLastNameToComapny: string[] = [];
  removedUserToComapny: UserDto[] = [];
  removedUserFirstLastNameToComapny: string[] = [];

  private searchSubject = new Subject<string>();
  private searchCompanySubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private companyAdministrationService: CompanyAdministrationService,
    private userAdministrationService: UserAdministrationService,
    private toastService: ToastrService,
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

  onUserSearch(searchInput: string) {
    const sort: Sort = {
      direction: 'ASC',
      field: 'lastName',
    };
    const body: GetUsersAdministrationRequest = {
      page: 0,
      size: 100,
      sorts: [sort],
      globalSearch: searchInput,
    };
    this.userAdministrationService.getPagedUsers({ body }).subscribe({
      next: (response) => {
        if (response.pagedResult?.users) {
          this.users = response.pagedResult.users
            .filter(
              (user) =>
                !this.companiesUsers
                  .map((selectedUser) => selectedUser.id)
                  .includes(user.id)
            )
            .sort((a, b) => a.lastName.localeCompare(b.lastName)); // Sort companies alphabetically by name
        }
      },
    });
  }

  onModifyUsersClick(company: CompanyDto){
    this.selectedCompany = company
    this.companiesUsers = structuredClone(company.users);
    this.users = [];
    this.userSearchVisible = true;
    this.addedUserToComapny = [];
    this.addedUserFirstLastNameToComapny = [];
    this.removedUserToComapny = [];
    this.removedUserFirstLastNameToComapny = [];
    this.globalUserSearch = '';
  }

  onUserChange(){
    const selectedCompanyUserIds = this.selectedCompany.users.map(
      (user) => user.id
    );
    const userComapnyIds = this.companiesUsers.map(
      (user) => user.id
    );

    this.addedUserToComapny = this.companiesUsers
      .filter(
        (companyUser) => !selectedCompanyUserIds.includes(companyUser.id)
      )
      .sort((a, b) => a.lastName.localeCompare(b.lastName));

      this.removedUserToComapny = this.selectedCompany.users
      .filter((user) => !userComapnyIds.includes(user.id))
      .sort((a, b) => a.lastName.localeCompare(b.lastName));

      this.addedUserFirstLastNameToComapny = this.addedUserToComapny.map((el) => el.firstName + ' ' + el.lastName)
      this.removedUserFirstLastNameToComapny = this.addedUserToComapny.map((el) => el.firstName + ' ' + el.lastName)
  }

  onApproveUserChanges(){
        this.loading = true;
        this.userSearchVisible = false;
        const body: AddOrDeleteCompaniesUsersAdministrationRequest = {
          usersIdsToAdd: this.addedUserToComapny.map((user) => user.id),
          usersIdsToRemove: this.removedUserToComapny.map((user) => user.id),
          companyId: this.selectedCompany.id,
        };
        this.userAdministrationService
          .addOrRemoveCompaniesUsers({ body })
          .subscribe({
            next: () => {
              this.loadCompanies();
              this.toastService.success('Użytkownicy zostali zmienionieni');
              this.loading = false;
            },
            error: (error) => {
              this.loading = false;
            },
          });
  }

  onInputUserChange(value: string){
    this.searchCompanySubject.next(value); // Pass the input value to the Subject
  }
}
