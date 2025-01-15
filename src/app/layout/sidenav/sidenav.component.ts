import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ContextService } from '../../services/context/context.service';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';

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
  @Output() 
  onOpenCollapsedSideNavToggle: EventEmitter<any> = new EventEmitter();
  isSubmenuOpen: boolean;
  permittedModules: Array<'LIVE_PANEL' | 'STATISTICS' | 'ORDERS' | 'RESTAURANT_ORDER' | 'ADMIN_PANEL' | string> = [];
  private destroy$ = new Subject<void>();


  constructor(
    private contextService: ContextService,
    private router: Router
  ) {
    this.isSubmenuOpen = false
  }

  ngOnInit() {
    this.contextService.contextSubjectVisibility$
    .pipe(takeUntil(this.destroy$))
    .subscribe((context) => {
      this.permittedModules = context?.permittedModules ?? [];
    });
  }

  ngOnChanges(): void {
    console.log('plz nie zajedz mnie')
    this.isSubmenuOpen = !this.isSideNavCollapsed && this.isSubmenuOpen
  }

  isActive(path: string): boolean {
    return this.router.url === path;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openCollapsedSideNavToggle() {
    if (this.isSideNavCollapsed == true) {
      this.isSubmenuOpen = false;
      this.onOpenCollapsedSideNavToggle.emit();
    }
  }

  toggleSubmenu() {
    this.isSubmenuOpen = !this.isSubmenuOpen;
  }

  hasPermissionToModule(
    module: 'LIVE_PANEL' | 'STATISTICS' | 'ORDERS' | 'RESTAURANT_ORDER' | 'ADMIN_PANEL' | string,
  ): boolean {
    return this.permittedModules.includes(module);
  }
}
