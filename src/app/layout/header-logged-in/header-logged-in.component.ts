import { Component } from '@angular/core';
import { DashboardGetInitConfigResponse } from '../../services/models';
import { DashboardService } from '../../services/services';

@Component({
  selector: 'app-header-logged-in',
  templateUrl: './header-logged-in.component.html',
  styleUrl: './header-logged-in.component.scss'
})
export class HeaderLoggedInComponent {
  isDropdownOpen = false;
  options: string[] = [];
  selectedOption: string | null = null;
  currentCompanyName: string = 'Brak firmy'
  response: DashboardGetInitConfigResponse = {};

  constructor(private dashboardService: DashboardService) { }

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
