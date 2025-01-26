import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule,
} from '@angular/common/http';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderGuestComponent } from './layout/header-guest/header-guest.component';
import { HttpTokenInterceptor } from './services/interceptor/http-token.interceptor';
import { SidenavComponent } from './layout/sidenav/sidenav.component';
import { HeaderLoggedInComponent } from './layout/header-logged-in/header-logged-in.component';
import { Dashboard2Component } from './pages/dashboard2/dashboard2.component';
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
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { DashboardPanelComponent } from './components/dashboard-panel/dashboard-panel.component';
import { InputSwitchModule } from 'primeng/inputswitch';
import { OrderListModule } from 'primeng/orderlist';
import { OrderActionsComponent } from './components/order-actions/order-actions.component';
import { PricePlnPipe } from './pipes/price-pln.pipe';
import { FormattedDatePipe } from './pipes/formatted-date.pipe';
import { NewOrderTableComponent } from './components/new-order-table/new-order-table.component';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { RatingModule } from 'primeng/rating';
import { TruncateOnResizePipe } from './pipes/truncate-on-resize.pipe';
import { AllOrdersComponent } from './pages/all-orders/all-orders.component';
import { AllOrdersTableComponent } from './components/all-orders-table/all-orders-table.component';
import { MultiSelectModule } from 'primeng/multiselect'; // Add this import
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { StatisticsComponent } from './pages/statistics/statistics.component';
import {
  BaseChartDirective,
  provideCharts,
  withDefaultRegisterables,
} from 'ng2-charts';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { NgToggleModule } from 'ng-toggle-button';
import { SwitchWithDialogComponent } from './components/switch-with-dialog/switch-with-dialog.component';
import { SocketService } from './services/websocket/socket-service';
import { FloatLabel, FloatLabelModule } from 'primeng/floatlabel'; // Add this!
import { InputNumberModule } from 'primeng/inputnumber';
import { CalendarWithDialogComponent } from './components/calendar-with-dialog/calendar-with-dialog.component';
import { FormattedDateTimePipe } from './pipes/formatted-date-time.pipe';
import { CardModule } from 'primeng/card';
import { MinuteFormatPipe } from './pipes/minute-format.pipe';
import { FormattedOnlyTimePipe } from './pipes/formatted-only-time.pipe copy';
import { DeliveyTimeDialogComponent } from './common/components/delivey-time-dialog/delivey-time-dialog.component';
import { MessagesModule } from 'primeng/messages';
import { ToastWebsocketComponent } from './common/components/toast-websocket/toast-websocket.component';
import { SortableColumnEntryComponent } from './components/sortable-column-entry/sortable-column-entry.component';
import { MainComponent } from './pages/main/main.component';
import { RestaurantOrderComponent } from './pages/restaurant-order/restaurant-order.component';
import { AdminPanelComponent } from './pages/admin-panel/admin-panel.component';
import { AdminPanelUsersComponent } from './pages/admin-panel-users/admin-panel-users.component';
import { AdminPanelComapniesComponent } from './pages/admin-panel-comapnies/admin-panel-comapnies.component';
import { PickListModule } from 'primeng/picklist';
import { AddCompanyComponent } from './pages/add-company/add-company.component';
import { MenuComponent } from './pages/menu/menu.component';
import { NewProductComponent } from './components/new-product/new-product.component';
import { CustomDialogComponent } from './components/custom-dialog/custom-dialog.component';
import { NewProductPropertiesListComponent } from './components/new-product-properties-list/new-product-properties-list.component';
import { NewProductTwoPagePanelComponent } from './components/new-product-two-page-panel/new-product-two-page-panel.component';
import { NewProductAddNewPropertyComponent } from './components/new-product-add-new-property/new-product-add-new-property.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    WelcomeComponent,
    ChangePasswordComponent,
    FooterComponent,
    HeaderGuestComponent,
    HeaderLoggedInComponent,
    SidenavComponent,
    Dashboard2Component,
    HeaderLoggedIn2Component,
    SwitchComponent,
    BodyComponent,
    CustomToastComponent,
    DashboardPanelComponent,
    OrderActionsComponent,
    PricePlnPipe,
    FormattedDatePipe,
    NewOrderTableComponent,
    TruncateOnResizePipe,
    AllOrdersComponent,
    AllOrdersTableComponent,
    StatisticsComponent,
    SwitchWithDialogComponent,
    CalendarWithDialogComponent,
    FormattedDateTimePipe,
    MinuteFormatPipe,
    FormattedOnlyTimePipe,
    DeliveyTimeDialogComponent,
    ToastWebsocketComponent,
    SortableColumnEntryComponent,
    MainComponent,
    RestaurantOrderComponent,
    AdminPanelComponent,
    AdminPanelUsersComponent,
    AdminPanelComapniesComponent,
    AddCompanyComponent,
    MenuComponent,
    NewProductComponent,
    CustomDialogComponent,
    NewProductPropertiesListComponent,
    NewProductAddNewPropertyComponent,
    NewProductTwoPagePanelComponent,
  ],
  imports: [
    RouterModule,
    ToastModule, // Add this line
    ButtonModule, // Needed for PrimeNG button components
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CardModule,
    MessagesModule,
    PickListModule,
    FormsModule,
    MatIconModule,
    ReactiveFormsModule,
    SelectButtonModule,
    FloatLabelModule,
    InputNumberModule,
    DropdownModule,
    MatToolbarModule,
    CheckboxModule,
    MatMenuModule,
    ToggleButtonModule,
    ConfirmDialogModule,
    MatDividerModule,
    MatListModule,
    BrowserAnimationsModule,
    SidebarModule,
    InputSwitchModule,
    OrderListModule,
    TableModule,
    TagModule,
    BaseChartDirective,
    DividerModule,
    CalendarModule,
    RatingModule,
    DialogModule,
    MultiSelectModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    NgToggleModule.forRoot(),
    ToastrModule.forRoot({
      progressBar: true,
      closeButton: true,
      newestOnTop: true,
      tapToDismiss: true,
      positionClass: 'toast-top-right',
      timeOut: 9000,
      maxOpened: 7,
    }),
  ],
  providers: [
    SocketService,
    HttpClient,
    provideCharts(withDefaultRegisterables()),
    MessageService,
    ConfirmationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpTokenInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthLogoutInterceptor, // Handles 401 errors and redirection
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
