import { Component } from '@angular/core';
import { TokenService } from './services/token/token.service';
import { LoginService } from './services/login/login.service';
import { SideNavToggle } from './components/side-nav-toggle.interface';
import { FilterService, PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'angular-foodapp';
  isSidebarVisible = true;
  screenWidth = 0;
  isLoggedIn = false;

  constructor(
    private loginService: LoginService,
    private primengConfig: PrimeNGConfig,
    private filterService: FilterService,
  ) {}

  ngOnInit() {
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
      console.log('isLoggedIn');
      console.log(this.isLoggedIn);
    });
    console.log('isLoggedIn');

    console.log(this.isLoggedIn);
  }

  onToggleSideNav(event: SideNavToggle) {
    this.isSidebarVisible = event.isSidebarVisible;
    this.screenWidth = event.screenWidth;
  }
}
