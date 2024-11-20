import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { SidebarService } from '../../services/sidebar/sidebar.service';
import { LoginService } from '../../services/login/login.service';
import { SideNavToggle } from '../../components/side-nav-toggle.interface';
import { ContextService } from '../../services/context/context.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent implements OnInit {
  @Output() onToogleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  isSidebarVisible = true;
  isSubmenuOpen = false;
  screenWidth = 0;
  _isLoggedIn = false;
  isSidebarHidden = false;
  tabletWith = 1000;
  permittedModules: Array<'LIVE_PANEL' | 'STATISTICS' | 'ORDERS'> = [];

  @Input() set isLoggedIn(value: boolean) {
    this._isLoggedIn = value;
  }

  constructor(
    private sidebarService: SidebarService,
    private contextService: ContextService,
  ) {}

  ngOnInit() {
    this.screenWidth = window.innerWidth;
    this.checkScreenWidth(); // Initial check when the component loads
    this.sidebarService.sidebarVisibility$.subscribe((isVisible) => {
      this.isSidebarVisible = isVisible;
      console.log('www' + this.isSidebarHidden);
      if (isVisible && this.screenWidth < this.tabletWith) {
        this.isSidebarHidden = true;
      }
      this.onToogleSideNav.emit({
        isSidebarVisible: this.isSidebarVisible,
        screenWidth: this.screenWidth,
      });
    });

    this.contextService.contextSubjectVisibility$.subscribe((context) => {
      this.permittedModules = context?.permittedModules ?? [];
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.screenWidth = window.innerWidth;
    this.checkScreenWidth(); // Check if window width is below 500px
    this.onToogleSideNav.emit({
      isSidebarVisible: this.isSidebarVisible,
      screenWidth: this.screenWidth,
    });
  }

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
    //this.sidebarService.toggleSidebar(); // Toggle sidebar state
    this.isSubmenuOpen = false;
    this.onToogleSideNav.emit({
      isSidebarVisible: this.isSidebarVisible,
      screenWidth: this.screenWidth,
    });
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
    if (this.screenWidth < this.tabletWith) {
      this.isSidebarHidden = true;
    } else if (
      this.screenWidth < 1200 &&
      this.isSidebarVisible &&
      this.screenWidth > this.tabletWith
    ) {
      this.isSidebarVisible = false;
      this.isSubmenuOpen = false;
      this.isSidebarHidden = false;
      this.sidebarService.toggleSidebar(); // Toggle sidebar state
    } else if (this.screenWidth > 1200 && !this.isSidebarVisible) {
      this.isSidebarHidden = false;
      this.sidebarService.toggleSidebar(); // Toggle sidebar state
    }
  }

  hasPermissionToModule(
    module: 'LIVE_PANEL' | 'STATISTICS' | 'ORDERS',
  ): boolean {
    return this.permittedModules.includes(module);
  }
}
