import { Component, Input } from '@angular/core';
import { SidebarService } from '../../services/sidebar/sidebar.service';
import { DashboardService } from '../../services/services/dashboard.service';
import {
  CompanyDto,
  DashboardGetInitConfigResponse,
  OrderDto,
} from '../../services/models';
import { ContextService } from '../../services/context/context.service';

@Component({
  selector: 'app-header-logged-in2',
  templateUrl: './header-logged-in2.component.html',
  styleUrl: './header-logged-in2.component.scss',
})
export class HeaderLoggedIn2Component {
  @Input()
  isLoggedIn: boolean = false;
  isChecked = false;
  isDropdownOpen = false;
  companies: CompanyDto[] | undefined;
  selectedCompany: CompanyDto | null = null;
  response: DashboardGetInitConfigResponse = {};
  isSidebarVisible = true;

  constructor(
    private sidebarService: SidebarService,
    private dashboardService: DashboardService,
    private contextService: ContextService
  ) {}

  ngOnInit(): void {
    this.dashboardService.getConfig().subscribe(
      (response) => {
        this.response = response;
        if (
          this.response.companyDataList &&
          this.response.companyDataList.length > 0
        ) {
          this.companies = this.response.companyDataList;
          let firstCompany = this.response.companyDataList[0];
          if (!!firstCompany) {
            this.selectedCompany = firstCompany;
            this.isChecked = firstCompany.receivingOrdersActive as boolean; // todo cos do zmiany
            this.updateContext();
            this.contextService.setContext(
              firstCompany.id as number,
              firstCompany.name as string,
              response.permittedModules ?? []
            );
          }
        }
      },
      (error) => {
        console.error('Error loading data:', error);
      }
    );
  }

  toggleSidebar() {
    // Check if the button click event is registered
    this.sidebarService.toggleSidebar();
    // Check if the visibility state is changing
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  updateContext() {
    if (this.selectedCompany !== null) {
      let permittedModules =
        this.contextService.getContext()?.permittedModules ?? [];

      this.contextService.setContext(
        this.selectedCompany.id as number,
        this.selectedCompany.name as string,
        permittedModules
      );
    }
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
  }

  companyOnChange() {}
}
