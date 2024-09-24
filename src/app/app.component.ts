import { Component } from '@angular/core';
import { TokenService } from './services/token/token.service';
import { LoginService } from './services/login/login.service';
import { SideNavToggle } from './components/side-nav-toggle.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'angular-foodapp';
  isSidebarVisible = true;
  screenWidth = 0;
  isLoggedIn = false;

  constructor(private loginService : LoginService) {
  }

  ngOnInit() {
    this.loginService.isLoggedInVisibility$.subscribe((isLogged) => {
      this.isLoggedIn = isLogged;
    });
  }

  onToggleSideNav(event: SideNavToggle) {
    this.isSidebarVisible = event.isSidebarVisible;
    this.screenWidth = event.screenWidth;
  }

}
