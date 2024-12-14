import { Component, Input } from '@angular/core';
import { SidebarService } from '../../services/sidebar/sidebar.service';
import { DashboardService } from '../../services/services/dashboard.service';
import { CompanyDto } from '../../services/models';
import { ContextService } from '../../services/context/context.service';
import { SocketService } from '../../services/websocket/socket-service';

@Component({
  selector: 'app-header-logged-in2',
  templateUrl: './header-logged-in2.component.html',
  styleUrl: './header-logged-in2.component.scss',
})
export class HeaderLoggedIn2Component {
  @Input()
  isLoggedIn: boolean = false;
  isChecked = false;
  isDropdownOpen = false;
  companies!: CompanyDto[];
  selectedCompany: CompanyDto | null = null;
  isSidebarVisible = true;
  stateOptions: any[] = [
    { label: 'One-Way', value: 'one-way' },
    { label: 'Return', value: 'return' },
  ];
  value: string = 'one-way';
  userId!: number;
  isHolding!: boolean;
  constructor(
    private sidebarService: SidebarService,
    private dashboardService: DashboardService,
    private contextService: ContextService,
    private webSocketService: SocketService
  ) {}

  ngOnInit(): void {
    this.dashboardService.getConfig().subscribe(
      (response) => {
        if (response.companyDataList && response.companyDataList.length > 0) {
          this.companies = response.companyDataList;
          let firstCompany = response.companyDataList[0];
          if (!!firstCompany) {
            this.selectedCompany = firstCompany;
            this.isChecked = firstCompany.receivingOrdersActive as boolean; // todo cos do zmiany
            this.userId = response.userId;
            this.updateContext(response.permittedModules);
            this.checkIfRecivingOrdersShouldBeTurnOn();
            this.isHolding = this.contextService.isHolding() 
          }
        }
      },
      (error) => {
        console.error('Error loading data:', error);
      }
    );
  }

  checkIfRecivingOrdersShouldBeTurnOn() {
    const storedDateTime = localStorage.getItem(
      'dateTimeToTurnOnRecivingOrders'
    );
    const lastRecivingOrdersComanyId = Number(
      localStorage.getItem('lastRecivingOrdersComanyId') || -2222
    );

    if (
      storedDateTime &&
      this.contextService.getCompanyId() === lastRecivingOrdersComanyId
    ) {
      const storedDate = new Date(storedDateTime);
      const currentDate = new Date();
      console.log(currentDate < storedDate);
      if (currentDate < storedDate) {
        this.isChecked = true;
      }
    }
  }

  toggleSidebar() {
    // Check if the button click event is registered
    this.sidebarService.toggleSidebar();
    // Check if the visibility state is changing
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  updateContext(
    permittedModules: Array<'LIVE_PANEL' | 'STATISTICS' | 'ORDERS'> | undefined
  ) {
    if (this.selectedCompany !== null) {
      if (!permittedModules) {
        permittedModules =
          this.contextService.getContext()?.permittedModules ?? [];
      }
      let companies =
        this.companies.length > 1 && this.companies.at(-1)?.id === -888
          ? this.companies.slice(0, -1)
          : this.companies;
      this.contextService.setContext(
        this.selectedCompany.id as number,
        this.selectedCompany.name as string,
        this.selectedCompany.webSocketTopicName as string,
        permittedModules,
        this.userId,
        companies
      );
    }
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
  }

  companyOnChange() {
    localStorage.removeItem('dateTimeToTurnOnRecivingOrders');
    localStorage.removeItem('lastRecivingOrdersComanyId');
    this.webSocketService.processDisconnection();
    this.updateContext(undefined);
    this.isHolding = this.contextService.isHolding()
  }
}
