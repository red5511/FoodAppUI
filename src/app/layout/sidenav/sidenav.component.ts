import { Component } from '@angular/core';
import { SidebarService } from '../../services/sidebar/sidebar.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss'
})
export class SidenavComponent {


  isSidebarVisible = true;
  isSubmenuOpen = false;
  isDashboardSelected = false;
  dynamicWidth: string = '200px';


  constructor(private sidebarService: SidebarService) { }

  ngOnInit() {
    this.sidebarService.sidebarVisibility$.subscribe((isVisible) => {
      console.log(isVisible)
      this.isSidebarVisible = isVisible;
    });
  }

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
    this.sidebarService.toggleSidebar(); // Toggle sidebar state
    this.isSubmenuOpen = false;
  }


  toggleSubmenu() {
    this.isSubmenuOpen = !this.isSubmenuOpen;
    if(this.isSidebarVisible == false){
      this.isSidebarVisible = !this.isSidebarVisible;
      this.sidebarService.toggleSidebar()
    }
  }


  selectDashboard() {
    this.isDashboardSelected = true;
  }
}
