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
  permittedModules: Array<'LIVE_PANEL' | 'STATISTICS' | 'ORDERS'> = [];
  private destroy$ = new Subject<void>();


  constructor(
    private contextService: ContextService,
    private router: Router
  ) {
    this.isSubmenuOpen = !this.isSideNavCollapsed && this.isSideNavVisible
  }

  ngOnInit() {
    console.log('sidevan')
    console.log(this.isSideNavVisible)
    console.log(this.isSideNavCollapsed)
    this.contextService.contextSubjectVisibility$
    .pipe(takeUntil(this.destroy$))
    .subscribe((context) => {
      this.permittedModules = context?.permittedModules ?? [];
    });
  }

  isActive(path: string): boolean {
    console.log('isActive')
    console.log(this.router.url)
    console.log(this.router.url === path)
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
    module: 'LIVE_PANEL' | 'STATISTICS' | 'ORDERS',
  ): boolean {
    return this.permittedModules.includes(module);
  }
}
