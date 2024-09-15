import { Component } from '@angular/core';
import { SidebarService } from '../../services/sidebar/sidebar.service';

@Component({
  selector: 'app-switch',
  templateUrl: './switch.component.html',
  styleUrl: './switch.component.scss'
})
export class SwitchComponent {
  constructor(private sidebarService: SidebarService) {
  }
  myFunction() {
    console.log("Witam")
    this.sidebarService.toggleSidebar(); // Toggle sidebar state

  }

}
