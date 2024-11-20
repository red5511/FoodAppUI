import { Component, Input } from '@angular/core';
import { SidebarService } from '../../services/sidebar/sidebar.service';
import { DashboardService } from '../../services/services/dashboard.service';
import {
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
  options: string[] = [];
  selectedOption: string | null = null;
  currentCompanyName: string = 'Brak firmy';
  response: DashboardGetInitConfigResponse = {};
  isSidebarVisible = true;

  constructor(
    private sidebarService: SidebarService,
    private dashboardService: DashboardService,
    private contextService: ContextService,
  ) {}

  ngOnInit(): void {
    this.dashboardService.getConfig().subscribe(
      (response) => {
        this.response = response;
        if (
          this.response.companyDataList &&
          this.response.companyDataList.length > 0
        ) {
          this.response.companyDataList.forEach((entry) => {
            this.options.push(entry.name as string);
          });
          let firstCompany = this.response.companyDataList[0];
          this.isChecked = firstCompany.receivingOrdersActive as boolean; // todo cos do zmiany
          this.currentCompanyName = firstCompany.name as string;
          this.contextService.setContext(
            firstCompany.id as number,
            firstCompany.name as string,
            response.permittedModules ?? [],
          );
        }
      },
      (error) => {
        console.error('Error loading data:', error);
      },
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

  closeDropdown(): void {
    this.isDropdownOpen = false;
  }

  selectOption(option: string): void {
    this.selectedOption = option;
    this.closeDropdown();
  }
}
