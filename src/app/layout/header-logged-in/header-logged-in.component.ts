import { Component } from '@angular/core';
import { DashboardGetInitConfigResponse } from '../../services/models';
import { DashboardService } from '../../services/services';

@Component({
  selector: 'app-header-logged-in',
  templateUrl: './header-logged-in.component.html',
  styleUrl: './header-logged-in.component.scss',
})
export class HeaderLoggedInComponent {
  isDropdownOpen = false;
  options: string[] = [];
  selectedOption: string | null = null;
  currentCompanyName: string = 'Brak firmy';

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getConfig().subscribe(
      (response) => {
        if (response.companyDataList && response.companyDataList.length > 0) {
          response.companyDataList.forEach((entry) => {
            this.options.push(entry.name as string);
          });
          this.currentCompanyName = response.companyDataList[0].name as string;
        }
      },
      (error) => {
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
