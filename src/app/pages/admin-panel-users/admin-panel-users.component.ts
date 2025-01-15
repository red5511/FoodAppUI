import { Component } from '@angular/core';
import {
  GetPagedUsersResponse,
  GetUsersAdministrationRequest,
  Sort,
  UserDto,
} from '../../services/models';
import { TableLazyLoadEvent } from 'primeng/table';
import { UserAdministrationService } from '../../services/services/user-administration.service';

@Component({
  selector: 'app-admin-panel-users',
  templateUrl: './admin-panel-users.component.html',
  styleUrl: './admin-panel-users.component.scss',
})
export class AdminPanelUsersComponent {
  users: UserDto[] = [];
  loading: boolean = true; // Initialize as true when loading data
  totalRecords!: number;
  selectedDates: Date[] = []; // Only 2 entries
  page: number = 1;
  size: number = 10;
  sorts!: Array<Sort>;
  globalSearch: string | undefined;

  constructor(private userAdministrationService: UserAdministrationService) {}

  loadOrdersLazy(event: TableLazyLoadEvent) {
    this.loading = true;
    this.page = Math.floor(event.first! / event.rows!);
    this.size = event.rows!;
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
          this.users = response.pagedResult.users!;
          this.totalRecords = response.pagedResult.totalRecords!;
          this.loading = false; // Set to false once data is loaded
        }
      },
      error: (error) => {
        console.error('Error fetching companyId:', error);
      },
    });
  }
}
