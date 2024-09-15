import { Component } from '@angular/core';
import { SidebarService } from '../../services/sidebar/sidebar.service';
import { DashboardService } from '../../services/services/dashboard.service';
import { DashboardGetInitConfigResponse } from '../../services/models';

@Component({
  selector: 'app-header-logged-in2',
  templateUrl: './header-logged-in2.component.html',
  styleUrl: './header-logged-in2.component.scss'
})
export class HeaderLoggedIn2Component {
  constructor(private sidebarService: SidebarService, private dashboardService: DashboardService) {}

  toggleSidebar() {
    // Check if the button click event is registered
      this.sidebarService.toggleSidebar();
      // Check if the visibility state is changing
    }

    isDropdownOpen = false;
    options: string[] = [];
    selectedOption: string | null = null;
    currentCompanyName: string = 'Brak firmy'
    response: DashboardGetInitConfigResponse = {};
    
    ngOnInit(): void {
      this.dashboardService.getConfig().subscribe(
        response => {
          this.response = response;
          if (this.response.companyDataList && this.response.companyDataList.length > 0) {
            this.response.companyDataList.forEach(entry => {
              this.options.push(entry.companyName as string);
            })
            this.currentCompanyName = this.response.companyDataList[0].companyName as string;
            console.log('Company Data List:', this.response.companyDataList[0]);
          }
          console.log('Data loaded:', this.response);
        },
        error => {
          console.error('Error loading data:', error);
        }
      );
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
