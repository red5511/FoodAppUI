import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ContextService } from '../../services/context/context.service';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { NavigationService } from '../../services/navigation/navigation-service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent implements OnInit {
  @Input()
  isSideNavVisible!: boolean;
  @Input()
  isSideNavCollapsed!: boolean;
  @Input()
  isTabletView!: boolean;
  @Input()
  isBodyCartRightBar!: boolean;
  @Output()
  onOpenCollapsedSideNavToggle: EventEmitter<any> = new EventEmitter();
  isSubmenuOpen: boolean;
  isSettingsSubmenuOpen: boolean = false;
  permittedModules: Array<
    | 'ONLINE_ORDERS'
    | 'STATISTICS'
    | 'ORDERS_HISTORY'
    | 'RESTAURANT_ORDERS'
    | 'ADMIN_PANEL'
    | 'SUPER_ADMIN_PANEL'
    | string
  > = [];
  isHolding: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(
    private contextService: ContextService,
    private router: Router,
    private navigationService: NavigationService
  ) {
    this.isSubmenuOpen = false;
  }

  ngOnInit() {
    this.contextService.contextSubjectVisibility$
      .pipe(takeUntil(this.destroy$))
      .subscribe((context) => {
        this.permittedModules = context?.permittedModules ?? [];
        this.isHolding = this.contextService.isHolding();
      });
  }

  ngOnChanges(): void {
    this.isSubmenuOpen = !this.isSideNavCollapsed && this.isSubmenuOpen;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isActive(path: string): boolean {
    return this.router.url === path;
  }

  openCollapsedSideNavToggle() {
    if (this.isSideNavCollapsed == true) {
      this.isSubmenuOpen = false;
      this.isSettingsSubmenuOpen = false;
      this.onOpenCollapsedSideNavToggle.emit();
    }
  }

  toggleSubmenu() {
    this.isSubmenuOpen = !this.isSubmenuOpen;
  }

  routerLinkOptions() {
    return this.isSideNavCollapsed ? { exact: true } : {};
  }

  hasPermissionToModule(
    module:
      | 'ONLINE_ORDERS'
      | 'STATISTICS'
      | 'ORDERS_HISTORY'
      | 'RESTAURANT_ORDERS'
      | 'ADMIN_PANEL'
      | 'SUPER_ADMIN_PANEL'
      | string
  ): boolean {
    return this.permittedModules.includes(module);
  }

  isExactForRestOrdering() {
    return (
      !this.isSideNavCollapsed ||
      this.router.url.includes('/restaurant-order/modify')
    );
  }

  onMenuClick() {
    console.log('onMenuClick');
    console.log(this.navigationService.getPreviousUrl());
    if (this.navigationService.getPreviousUrl()?.includes('/menu/products')) {
      this.isSubmenuOpen = true;
    } else {
      this.toggleSubmenu();
    }
    this.openCollapsedSideNavToggle();
    this.router.navigate(['/menu/products']);
  }

  onSettingsClick() {
    console.log('onSettingsClick');
    console.log(this.navigationService.getPreviousUrl());
    if (
      this.navigationService.getPreviousUrl()?.includes('/settings/bluetooth')
    ) {
      this.isSettingsSubmenuOpen = true;
    } else {
      this.toggleSettingsSubmenu();
    }
    this.openCollapsedSideNavToggle();
    this.router.navigate(['/settings/bluetooth']);
  }

  toggleSettingsSubmenu() {
    this.isSettingsSubmenuOpen = !this.isSettingsSubmenuOpen;
  }

  displayFullVersion() {
    return !this.isSideNavCollapsed || this.isBodyCartRightBar;
  }
}
