import { Component, EventEmitter, Output } from '@angular/core';
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
  @Output()
  onToggleSidnav: EventEmitter<any> = new EventEmitter<any>();
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
  receivingCompanies: CompanyDto[] = []
  companiesPossibleToReceiving!: CompanyDto[];
  constructor(
    private dashboardService: DashboardService,
    private contextService: ContextService,
    private webSocketService: SocketService
  ) {}

  ngOnInit(): void {
    this.dashboardService.getConfig().subscribe(
      (response) => {
        if (response.companyDataList && response.companyDataList.length > 0) {
          this.companies = response.companyDataList;
          this.companiesPossibleToReceiving = this.companies.filter(company => !company.holding)
          let firstCompany = response.companyDataList[0];
          if (!!firstCompany) {
            this.selectedCompany = firstCompany;
            this.isChecked = firstCompany.receivingOrdersActive as boolean; // todo cos do zmiany
            this.userId = response.userId;
            this.updateContext(response.permittedModules);
            this.checkIfRecivingOrdersShouldBeTurnOn();
            this.isHolding = this.contextService.isHolding();
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

  onStartReceiving(){
    console.log('onStartReceiving')
    console.log(this.receivingCompanies)
    this.updateContext(undefined)
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
        this.selectedCompany,
        permittedModules,
        this.userId,
        companies,
        this.receivingCompanies
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
    this.receivingCompanies = []
    this.updateContext(undefined);
    this.isHolding = this.contextService.isHolding();
  }
}
