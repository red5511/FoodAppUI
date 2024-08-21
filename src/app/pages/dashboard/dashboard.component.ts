import { Component } from '@angular/core';
import { DashboardService } from '../../services/services';
import { TokenService } from '../../services/token/token.service';
import { DashboardGetInitConfigResponse } from '../../services/models';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  response: DashboardGetInitConfigResponse = {};


  constructor(
    private dashboardService: DashboardService,
    private tokenService: TokenService
  ) {
  }

  ngOnInit(): void {
    this.dashboardService.getConfig().subscribe(
      response => {
        this.response = response;
        console.log('Data loaded:', this.response);
      },
      error => {
        console.error('Error loading data:', error);
      }
    );
  }
}
