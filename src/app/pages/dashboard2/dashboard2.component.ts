import { Component } from '@angular/core';
import { SidebarService } from '../../services/sidebar/sidebar.service';

@Component({
  selector: 'app-dashboard2',
  templateUrl: './dashboard2.component.html',
  styleUrl: './dashboard2.component.scss'
})
export class Dashboard2Component {


  isSidebarVisible = true;
  isSubmenuOpen = false;
  isDashboardSelected = false;


  constructor(private sidebarService: SidebarService) {}

  ngOnInit() {
    this.sidebarService.sidebarVisibility$.subscribe((isVisible) => {
      console.log(isVisible)
      this.isSidebarVisible = isVisible;
    });
  }

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
    this.sidebarService.toggleSidebar(); // Toggle sidebar state
  }


  toggleSubmenu() {
    this.isSubmenuOpen = !this.isSubmenuOpen;
  }


  selectDashboard() {
    this.isDashboardSelected = true;
  }
}
