import { Component } from '@angular/core';
import { SidebarService } from '../../services/sidebar/sidebar.service';

@Component({
  selector: 'app-header-logged-in2',
  templateUrl: './header-logged-in2.component.html',
  styleUrl: './header-logged-in2.component.scss'
})
export class HeaderLoggedIn2Component {
  constructor(private sidebarService: SidebarService) {}

  toggleSidebar() {
    // Check if the button click event is registered
      this.sidebarService.toggleSidebar();
      // Check if the visibility state is changing
    }
}
