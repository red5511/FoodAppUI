import { Component, EventEmitter, Output } from '@angular/core';
import { DashboardService } from '../../services/services/dashboard.service';
import { CompanyDto } from '../../services/models';
import { ContextService } from '../../services/context/context.service';
import { SocketService } from '../../services/websocket/socket-service';
import { TokenService } from '../../services/token/token.service';
import { LoginService } from '../../services/login/login.service';
import { Router } from '@angular/router';
import { BluetoothService } from '../../services/bluetooth/bluetooth-service';
import { Capacitor } from '@capacitor/core';

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
  receivingCompanies: CompanyDto[] = [];
  companiesPossibleToReceiving!: CompanyDto[];
  isWeb: boolean = Capacitor.getPlatform() === 'web';

  constructor(
    private dashboardService: DashboardService,
    private contextService: ContextService,
    private webSocketService: SocketService,
    private tokenService: TokenService,
    private loginService: LoginService,
    private router: Router,
    private bluetoothService: BluetoothService
  ) {}

  ngOnInit(): void {
    this.dashboardService.getConfig().subscribe(
      (response) => {
        if (response.companyDataList) {
          this.companies = response.companyDataList;
          this.companiesPossibleToReceiving = this.companies.filter(
            (company) => !company.holding
          );
          let firstCompany = response.companyDataList[0];

          this.selectedCompany = firstCompany;
          this.userId = response.userId;
          this.updateContext(response.permittedModules);
          this.checkIfRecivingOrdersShouldBeTurnOn();
          this.isHolding = this.contextService.isHolding();
        }
      },
      (error) => {
        console.error('Error loading data:', error);
      }
    );
    if (!this.isWeb) {
      setTimeout(() => {
        this.bluetoothService.connectOnAppStart();
      }, 3500);
    }
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

  onStartReceiving(xd: CompanyDto[]) {
    this.updateContext(undefined);
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  updateContext(
    permittedModules:
      | Array<
          | 'ONLINE_ORDERS'
          | 'STATISTICS'
          | 'ORDERS'
          | 'RESTAURANT_ORDERS'
          | 'ADMIN_PANEL'
          | string
        >
      | undefined
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
    this.removeConnections();
    this.receivingCompanies = [];
    this.updateContext(undefined);
    this.isHolding = this.contextService.isHolding();
  }

  logout() {
    this.removeConnections();
    this.tokenService.removeToken();
    this.loginService.changeLoggedInStatus();
    this.router.navigate(['/login']);
  }

  removeConnections() {
    this.webSocketService.processDisconnection();
  }
}
