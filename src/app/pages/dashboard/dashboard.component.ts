import { Component } from '@angular/core';
import { DashboardService } from '../../services/services';
import { TokenService } from '../../services/token/token.service';
import { DashboardGetInitConfigResponse } from '../../services/models';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  constructor() {}

  getAllOrders() {
    throw new Error('Method not implemented.');
  }
  getActiveOrders() {
    throw new Error('Method not implemented.');
  }
}
