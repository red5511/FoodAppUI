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
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { SwitchComponent } from './components/switch/switch.component';
import { BodyComponent } from './layout/body/body.component';
import { AuthLogoutInterceptor } from './services/interceptor/auth-logout.interceptor';
import { ToastrModule } from 'ngx-toastr';
import { CustomToastComponent } from './components/custom-toast/custom-toast.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { OrderSidebnarComponent } from './components/order-sidebnar/order-sidebnar.component';
import { SidebarModule } from 'primeng/sidebar';
import { DashboardPanelComponent } from './components/dashboard-panel/dashboard-panel.component';
import { InputSwitchModule } from 'primeng/inputswitch';
import { OrderListModule } from 'primeng/orderlist';
import { OrderSidebarElementComponent } from './components/order-sidebar-element/order-sidebar-element.component';
import { NewOrderPanelComponent } from './layout/new-order-panel/new-order-panel.component';
import { PricePlnPipe } from './pipes/price-pln.pipe';
import { FormattedDatePipe } from './pipes/formatted-date.pipe';

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
    SwitchComponent,
    BodyComponent,
    CustomToastComponent,
    OrderSidebnarComponent,
    DashboardPanelComponent,
    OrderSidebarElementComponent,
    NewOrderPanelComponent,
    PricePlnPipe,
    FormattedDatePipe,
  ],
  imports: [
    RouterModule,
    ToastModule, // Add this line
    ButtonModule, // Needed for PrimeNG button components
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    MatDividerModule,
    MatListModule,
    BrowserAnimationsModule,
    SidebarModule,
    InputSwitchModule,
    OrderListModule,
    ToastrModule.forRoot(
      {
        progressBar: true,
        closeButton: true,
        newestOnTop: true,
        tapToDismiss: true,
        positionClass: 'toast-top-right',
        timeOut: 0,
        maxOpened: 7
      }
    ),
  ],
  providers: [HttpClient,
    MessageService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpTokenInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthLogoutInterceptor,  // Handles 401 errors and redirection
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
