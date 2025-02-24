import { Component, HostListener } from '@angular/core';
import { LoginService } from './services/login/login.service';
import { SideNavToggle } from './components/side-nav-toggle.interface';
import { FilterService, MessageService, PrimeNGConfig } from 'primeng/api';
import { SocketService } from './services/websocket/socket-service';
import { ContextService } from './services/context/context.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'angular-foodapp';
  isSideNavVisible: boolean;
  screenWidth = 0;
  isLoggedIn = false;
  isSideNavCollapsed: boolean;
  isTabletView: boolean;
  isBodyCartRightBar: boolean = false;
  tabletMinWith: number = 1000;
  tabletMaxWith: number = 1200;
  activeRoute: string = '';

  constructor(
    private loginService: LoginService,
    private primengConfig: PrimeNGConfig,
    private filterService: FilterService,
    private webSocketService: SocketService,
    private contextService: ContextService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.screenWidth = window.innerWidth;
    this.isSideNavVisible =
      this.screenWidth > this.tabletMinWith ? true : false;
    this.isSideNavCollapsed =
      this.screenWidth < this.tabletMaxWith &&
      this.screenWidth > this.tabletMinWith
        ? true
        : false;
    this.isTabletView = this.screenWidth < this.tabletMinWith;
  }

  ngOnInit() {
    window.addEventListener('beforeunload', this.handleWindowClose);
    this.primengConfig.ripple = true;
    this.primengConfig.setTranslation({
      selectionMessage: '{0} Zaznaczone',
      startsWith: 'Zaczyna się od',
      contains: 'Zawiera',
      notContains: 'Nie zawiera',
      endsWith: 'Kończy się na',
      equals: 'Równe',
      notEquals: 'Nie równe',
      noFilter: 'Brak filtra',
      lt: 'Mniejszy niż',
      lte: 'Mniejszy lub równy',
      gt: 'Większy niż',
      gte: 'Większy lub równy',
      matchAll: 'Dopasuj wszystkie',
      dateIs: 'Data to',
      dateIsNot: 'Data to nie',
      dateAfter: 'Data po',
      dateBefore: 'Data przed',
      dayNames: [
        'Niedziela',
        'Poniedziałek',
        'Wtorek',
        'Środa',
        'Czwartek',
        'Piątek',
        'Sobota',
      ],
      dayNamesShort: ['Niedz', 'Pon', 'Wto', 'Śro', 'Czw', 'Pia', 'Sob'],
      dayNamesMin: ['N', 'P', 'W', 'Ś', 'C', 'P', 'S'],
      monthNames: [
        'Styczeń',
        'Luty',
        'Marzec',
        'Kwiecień',
        'Maj',
        'Czerwiec',
        'Lipiec',
        'Sierpień',
        'Wrzesień',
        'Październik',
        'Listopad',
        'Grudzień',
      ],
      monthNamesShort: [
        'Sty',
        'Lut',
        'Mar',
        'Kwi',
        'Maj',
        'Cze',
        'Lip',
        'Sie',
        'Wrz',
        'Paź',
        'Lis',
        'Gru',
      ],
      today: 'Dziś',
      clear: 'Wyczyść',
      apply: 'Zastosuj',
      weekHeader: 'Tydz',
      firstDayOfWeek: 1, // 0 for Sunday, 1 for Monday
      dateFormat: 'dd/mm/yy', // Adjust date format as needed
      // Other translations as needed
    });
    this.loginService.isLoggedInVisibility$.subscribe((isLogged) => {
      this.isLoggedIn = isLogged;
    });
    this.router.events.subscribe(() => {
      this.activeRoute = this.router.url
      this.isBodyCartRightBar = this.activeRoute.includes('/restaurant-order') && this.screenWidth > 1200;
    });
  }

  ngOnDestroy() {
    window.removeEventListener('beforeunload', this.handleWindowClose);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.screenWidth = window.innerWidth;
    this.isTabletView = this.screenWidth < this.tabletMinWith;
    if (this.screenWidth < this.tabletMinWith) {
      this.isSideNavVisible = false;
    } else if (
      this.screenWidth < this.tabletMaxWith &&
      this.screenWidth > this.tabletMinWith
    ) {
      this.isSideNavCollapsed = true;
      this.isSideNavVisible = true;
    } else if (this.screenWidth > 1200) {
      this.isSideNavCollapsed = false;
      this.isSideNavVisible = true;
    }

    if(this.activeRoute.includes('/restaurant-order') && this.screenWidth > 1200){
      this.isBodyCartRightBar = true
    }
    else if(this.screenWidth < 1200){
      this.isBodyCartRightBar = false
    }
    console.log('Visible ' + this.isSideNavVisible);
    console.log('Collapsed ' + this.isSideNavCollapsed);
    console.log('isBodyCartRightBar ' + this.isBodyCartRightBar);
  }

  onToggleSidnav() {
    if (this.screenWidth < this.tabletMinWith) {
      this.isSideNavVisible = !this.isSideNavVisible;
      this.isSideNavCollapsed = false;
    } else if (
      this.screenWidth < this.tabletMaxWith &&
      this.screenWidth > this.tabletMinWith
    ) {
      this.isSideNavCollapsed = !this.isSideNavCollapsed;
      this.isSideNavVisible = true;
    } else {
      this.isSideNavCollapsed = !this.isSideNavCollapsed;
      this.isSideNavVisible = true;
    }
  }

  private handleWindowClose = () => {
    if (this.webSocketService.isConnected) {
      const currentDate = new Date();
      const dateTimeToTurnOnRecivingOrders = new Date(
        currentDate.getTime() + 5 * 60000
      ).toISOString();
      localStorage.setItem(
        'dateTimeToTurnOnRecivingOrders',
        dateTimeToTurnOnRecivingOrders
      );
      localStorage.setItem(
        'lastRecivingOrdersComanyId',
        this.contextService.getCompanyId()?.toString() ?? '-99999'
      );
    }
    const windowCount = Number(
      localStorage.getItem('activeSocketWindowCount') || 0
    );
    if (windowCount === 1) {
      this.webSocketService.processDisconnection();
    } else {
      if (this.webSocketService.isConnected) {
        const windowCount = Number(
          localStorage.getItem('activeSocketWindowCount') || 0
        );
        const updatedCount = Math.max(windowCount - 1, 0);
        localStorage.setItem(
          'activeSocketWindowCount',
          updatedCount.toString()
        );
      }
    }
  };

  onOpenCollapsedSideNavToggle() {
    this.isSideNavVisible = true;
    this.isSideNavCollapsed = false;
  }
}
