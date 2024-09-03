import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { FormsModule } from '@angular/forms';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderGuestComponent } from './layout/header-guest/header-guest.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HttpTokenInterceptor } from './services/interceptor/http-token.interceptor';
import { SidenavComponent } from './layout/sidenav/sidenav.component';
import { HeaderLoggedInComponent } from './layout/header-logged-in/header-logged-in.component';
import { Dashboard2Component } from './pages/dashboard2/dashboard2.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HeaderLoggedIn2Component } from './layout/header-logged-in2/header-logged-in2.component';
import { MatToolbarModule  } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    WelcomeComponent,
    ChangePasswordComponent,
    FooterComponent,
    HeaderGuestComponent,
    DashboardComponent,
    HeaderLoggedInComponent,
    SidenavComponent,
    Dashboard2Component,
    HeaderLoggedIn2Component,
  ],
  imports: [
    RouterModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    MatDividerModule,
    MatListModule,
  ],
  providers: [HttpClient,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpTokenInterceptor,
      multi: true
    },
    provideAnimationsAsync('noop')
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
