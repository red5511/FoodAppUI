import { Component } from '@angular/core';
import {
  AddOrDeleteUsersCompaniesAdministrationRequest,
  AddOrDeleteUsersPermissionsAdministrationRequest,
  CompanyDto,
  GetCompanyAdministrationRequest,
  GetPagedUsersResponse,
  GetUsersAdministrationRequest,
  Sort,
  UserDto,
} from '../../services/models';
import {
  TableLazyLoadEvent,
  TableRowCollapseEvent,
  TableRowExpandEvent,
} from 'primeng/table';
import { UserAdministrationService } from '../../services/services/user-administration.service';
import { debounceTime, Subject, takeUntil } from 'rxjs';
import {
  AuthenticationService,
  CompanyAdministrationService,
} from '../../services/services';
import { BlockUser$Params } from '../../services/fn/authentication/block-user';
import { ToastrService } from 'ngx-toastr';
import { UnblockUser$Params } from '../../services/fn/authentication/unblock-user';

type UserPermission =
  | 'VIEW_ONLINE_ORDERING'
  | 'VIEW_STATISTICS'
  | 'VIEW_ORDERS_HISTORY'
  | 'VIEW_RESTAURANT_ORDERING'
  | 'ADMINISTRATOR'
  | 'SUPER_ADMINISTRATOR';

@Component({
  selector: 'app-admin-panel-users',
  templateUrl: './admin-panel-users.component.html',
  styleUrl: './admin-panel-users.component.scss',
})
export class AdminPanelUsersComponent {
  users: UserDto[] = [];
  companies: CompanyDto[] = [];
  usersCompanies: CompanyDto[] = [];
  usersPermission: UserPermission[] = [];
  allPermission: UserPermission[] = [];
  allPermissionCloned: UserPermission[] = [];
  addedCompanyIdsToUser: number[] = [];
  addedPermissionsToUser: UserPermission[] = [];
  removedCompanyIdsToUser: number[] = [];
  removedPermissionsToUser: UserPermission[] = [];
  loading: boolean = true; // Initialize as true when loading data
  totalRecords!: number;
  selectedDates: Date[] = []; // Only 2 entries
  page: number = 1;
  size: number = 10;
  sorts!: Array<Sort>;
  globalSearch: string | undefined;
  globalCompanySearch: string | undefined;
  sortState: { [key: string]: string } = {};
  expandedRows: { [s: string]: boolean } = {};
  dialogBanVisible: boolean = false;
  dialogUnbanVisible: boolean = false;
  companySearchVisible: boolean = false;
  permissionDialogVisible = false;
  selectedUser!: UserDto;
  sourceProducts: UserDto[] = [];
  private searchSubject = new Subject<string>();
  private searchCompanySubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private userAdministrationService: UserAdministrationService,
    private authService: AuthenticationService,
    private toastService: ToastrService,
    private companyAdministrationService: CompanyAdministrationService
  ) {
    this.setDefoultSorts();
  }

  ngOnInit(): void {
    this.userAdministrationService.getAllPermissions().subscribe({
      next: (response) => {
        this.allPermission = response.permissions;
      },
    });
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
        this.onComapnySearch(searchTerm);
      });
  }

  loadUsersLazy(event: TableLazyLoadEvent) {
    this.loading = true;
    this.page = Math.floor(event.first! / event.rows!);
    this.size = event.rows!;
    this.loadUsers();
  }

  loadUsers() {
    const dateRange = this.selectedDates.at(0)
      ? 'CUSTOM_DATE_RANGE'
      : undefined;
    const body: GetUsersAdministrationRequest = {
      page: this.page,
      size: this.size,
      sorts: this.sorts,
      dateFrom: this.selectedDates.at(0)?.toLocaleDateString(),
      dateTo: this.selectedDates?.at(1)?.toLocaleDateString(),
      globalSearch: this.globalSearch,
      dateRange,
    };
    this.userAdministrationService.getPagedUsers({ body }).subscribe({
      next: (response: GetPagedUsersResponse) => {
        if (response && response.pagedResult) {
          this.users = response.pagedResult.users ?? [];
          this.totalRecords = response.pagedResult.totalRecords ?? 0;
          this.loading = false; // Set to false once data is loaded
          console.log('loadOrders');
          console.log(response);
        }
      },
      error: (error) => {
        console.error('Error fetching companyId:', error);
      },
    });
  }

  onInputChange(value: string): void {
    this.searchSubject.next(value); // Pass the input value to the Subject
  }

  onInputCompanyChange(value: string): void {
    this.searchCompanySubject.next(value); // Pass the input value to the Subject
  }

  onFilterChange(searchTerm: string) {
    this.globalSearch = searchTerm;
    console.log('onFilterChange');
    this.loading = true;
    this.loadUsers();
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
    this.loadUsers();
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

  onRowExpand(event: TableRowExpandEvent) {
    const order = event.data;
    this.collapseAll();
    this.expandedRows[order.id] = true;
  }

  onRowCollapse(event: TableRowCollapseEvent) {
    const user = event.data;
    delete this.expandedRows[user.id];
  }

  expandAll() {
    this.users.forEach((order) => (this.expandedRows[order.id!] = true));
  }

  collapseAll() {
    this.expandedRows = {};
  }

  onCalendarSelect() {
    this.loadUsers();
  }

  onBanDialog(user: UserDto) {
    this.dialogBanVisible = true;
    this.selectedUser = user;
  }

  onUnbanDialog(user: UserDto) {
    this.dialogUnbanVisible = true;
    this.selectedUser = user;
  }

  onBanConfirm() {
    this.dialogBanVisible = false;
    const params: BlockUser$Params = {
      userId: this.selectedUser.id,
    };
    this.authService.blockUser(params).subscribe({
      next: () => {
        this.selectedUser.locked = true;
        this.toastService.success('Użytkownik został zablokowany');
      },
    });
  }

  onUnbanConfirm() {
    this.dialogUnbanVisible = false;
    const params: UnblockUser$Params = {
      userId: this.selectedUser.id,
    };
    this.authService.unblockUser(params).subscribe({
      next: () => {
        this.selectedUser.locked = false;
        this.toastService.success('Użytkownik został odblokowany');
      },
    });
  }

  onModifyCompanyClick(user: UserDto) {
    this.selectedUser = user;
    this.usersCompanies = structuredClone(user.companies);
    this.companies = [];
    this.companySearchVisible = true;
    this.addedCompanyIdsToUser = [];
    this.removedCompanyIdsToUser = [];
    this.globalCompanySearch = '';
  }

  onComapnySearch(input: string) {
    const sort: Sort = {
      direction: 'ASC',
      field: 'name',
    };
    const body: GetCompanyAdministrationRequest = {
      globalSearch: input,
      page: 0,
      size: 100,
      sorts: [sort],
    };
    this.companyAdministrationService.getPagedCompanies({ body }).subscribe({
      next: (response) => {
        if (response.pagedResult?.companies) {
          this.companies = response.pagedResult.companies
            .filter(
              (company) =>
                !this.usersCompanies
                  .map((selectedComapny) => selectedComapny.id)
                  .includes(company.id)
            )
            .sort((a, b) => a.name.localeCompare(b.name)); // Sort companies alphabetically by name
        }
      },
    });
  }

  onCompanyChange() {
    const selectedUserComapnyIds = this.selectedUser.companies.map(
      (company) => company.id
    );
    const userComapnyIds = this.usersCompanies.map(
      (usersCompany) => usersCompany.id
    );

    this.addedCompanyIdsToUser = userComapnyIds
      .filter(
        (userCompanyId) => !selectedUserComapnyIds.includes(userCompanyId)
      )
      .sort((a, b) => a - b);
    this.removedCompanyIdsToUser = selectedUserComapnyIds
      .filter((usersCompanyId) => !userComapnyIds.includes(usersCompanyId))
      .sort((a, b) => a - b);
  }

  onApproveCompanyChanges() {
    this.loading = true;
    this.companySearchVisible = false;
    const body: AddOrDeleteUsersCompaniesAdministrationRequest = {
      companyIdsToAdd: this.addedCompanyIdsToUser,
      companyIdsToRemove: this.removedCompanyIdsToUser,
      userId: this.selectedUser.id,
    };
    this.companyAdministrationService
      .addOrRemoveUsersCompanies({ body })
      .subscribe({
        next: () => {
          this.loadUsers();
          this.toastService.success('Firmy zostały zmienione');
          this.loading = false;
        },
        error: (error) => {
          this.loading = false;
        },
      });
  }

  onModifyPermissionsClick(user: UserDto) {
    this.addedPermissionsToUser = [];
    this.removedPermissionsToUser = [];
    this.selectedUser = user;
    this.usersPermission = structuredClone(user.permissions);
    this.allPermissionCloned = structuredClone(this.allPermission).filter(
      (permission) => !this.usersPermission.includes(permission)
    );
    this.permissionDialogVisible = true;
  }

  onPermissionChange() {
    this.addedPermissionsToUser = this.usersPermission.filter(
      (permission) => !this.selectedUser.permissions.includes(permission)
    );
    this.removedPermissionsToUser = this.selectedUser.permissions.filter(
      (permission) => !this.usersPermission.includes(permission)
    );
  }

  onApprovePermissionChanges() {
    this.loading = true;
    this.permissionDialogVisible = false;
    const body: AddOrDeleteUsersPermissionsAdministrationRequest = {
      permissionToAdd: this.addedPermissionsToUser,
      permissionToRemove: this.removedPermissionsToUser,
      userId: this.selectedUser.id,
    };
    this.userAdministrationService
      .addOrRemoveUsersPermissions({ body })
      .subscribe({
        next: () => {
          this.loadUsers();
          this.toastService.success('Uprawnienia zostały zmienione');
          this.loading = false;
        },
        error: (error) => {
          this.loading = false;
        },
      });
  }
}
