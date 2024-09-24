import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { SidebarService } from '../../services/sidebar/sidebar.service';
import { LoginService } from '../../services/login/login.service';
import { SideNavToggle } from '../../components/side-nav-toggle.interface';


@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss'
})
export class SidenavComponent implements OnInit {

  @Output() onToogleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  isSidebarVisible = true;
  isSubmenuOpen = false;
  screenWidth = 0;
  _isLoggedIn = false;

  @Input() set isLoggedIn(value: boolean) {
    this._isLoggedIn = value;
    console.log("kekkk");
    console.log(this._isLoggedIn);
  }

  constructor(private sidebarService: SidebarService,
    private loginService: LoginService
  ) { }

  ngOnInit() {
    this.screenWidth = window.innerWidth;
    this.checkScreenWidth(); // Initial check when the component loads
    console.log("sidenav")
    this.sidebarService.sidebarVisibility$.subscribe((isVisible) => {
      console.log(isVisible)
      this.isSidebarVisible = isVisible;
      this.onToogleSideNav.emit({ isSidebarVisible: this.isSidebarVisible, screenWidth: this.screenWidth })
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.screenWidth = window.innerWidth;
    this.checkScreenWidth();  // Check if window width is below 500px
    this.onToogleSideNav.emit({ isSidebarVisible: this.isSidebarVisible, screenWidth: this.screenWidth });
  }

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
    //this.sidebarService.toggleSidebar(); // Toggle sidebar state
    this.isSubmenuOpen = false;
    this.onToogleSideNav.emit({ isSidebarVisible: this.isSidebarVisible, screenWidth: this.screenWidth })
  }

  toggleSidebarIfClosed() {
    if (this.isSidebarVisible == false) {
      this.toggleSidebar();
    }
  }

  toggleSubmenu() {
    this.isSubmenuOpen = !this.isSubmenuOpen;
  }

  checkScreenWidth() {
    if (this.screenWidth < 650) {
      this.isSidebarVisible = false;
      this.isSubmenuOpen = false;
      //this.sidebarService.toggleSidebar(); // Toggle sidebar state
    }
    if (this.screenWidth > 650 && !this.isSidebarVisible) {
      this.isSidebarVisible = true;
    }
  }
}
