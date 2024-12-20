import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ContextService } from '../../services/context/context.service';
import { Subject, takeUntil } from 'rxjs';

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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openCollapsedSideNavToggle() {
    if (this.isSideNavVisible == false) {
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
