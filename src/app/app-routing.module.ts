import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { Dashboard2Component } from './pages/dashboard2/dashboard2.component';
import { noneAuthPathsWhenJwtPresentGuard } from './services/guard/none-auth-paths-when-jwt-present.guard';
import { authGuard } from './services/guard/auth.guard';
import { AllOrdersComponent } from './pages/all-orders/all-orders.component';
import { StatisticsComponent } from './pages/statistics/statistics.component';
import { MainComponent } from './pages/main/main.component';
import { RestaurantOrderComponent } from './pages/restaurant-order/restaurant-order.component';
import { AdminPanelComponent } from './pages/admin-panel/admin-panel.component';
import { AdminPanelUsersComponent } from './pages/admin-panel-users/admin-panel-users.component';
import { AdminPanelComapniesComponent } from './pages/admin-panel-comapnies/admin-panel-comapnies.component';
import { AddCompanyComponent } from './pages/add-company/add-company.component';
import { MenuComponent } from './pages/menu/menu.component';
import { MenuCategoryComponent } from './pages/menu-category/menu-category.component';
import { DeliveryOrderingComponent } from './pages/delivery-ordering/delivery-ordering.component';
import { SettingsBluetoothComponent } from './pages/settings-bluetooth/settings-bluetooth.component';
import { MenuDeliveryOptionComponent } from './pages/menu-delivery-option/menu-delivery-option.component';

const routes: Routes = [
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [noneAuthPathsWhenJwtPresentGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [noneAuthPathsWhenJwtPresentGuard],
  },
  {
    path: 'welcome',
    component: WelcomeComponent,
    canActivate: [noneAuthPathsWhenJwtPresentGuard],
  },
  {
    path: 'changePassword',
    component: ChangePasswordComponent,
    canActivate: [noneAuthPathsWhenJwtPresentGuard],
  },
  {
    path: 'active-orders',
    component: Dashboard2Component,
    canActivate: [authGuard],
  },
  {
    path: 'orders',
    component: AllOrdersComponent,
    canActivate: [authGuard],
  },
  {
    path: 'statistics',
    component: StatisticsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'main',
    component: MainComponent,
    canActivate: [authGuard],
  },
  {
    path: 'restaurant-order',
    component: RestaurantOrderComponent,
    canActivate: [authGuard],
  },
  {
    path: 'restaurant-order/modify',
    component: RestaurantOrderComponent,
    canActivate: [authGuard],
  },
  {
    path: 'restaurant-order/delivery',
    component: RestaurantOrderComponent,
    canActivate: [authGuard],
  },
  {
    path: 'delivery-order',
    component: DeliveryOrderingComponent,
    canActivate: [authGuard],
  },
  {
    path: 'menu/products',
    component: MenuComponent,
    canActivate: [authGuard],
  },
  {
    path: 'menu/category',
    component: MenuCategoryComponent,
    canActivate: [authGuard],
  },
  {
    path: 'menu/delivery-options',
    component: MenuDeliveryOptionComponent,
    canActivate: [authGuard],
  },
  {
    path: 'settings/bluetooth',
    component: SettingsBluetoothComponent,
    canActivate: [authGuard],
  },
  {
    path: 'admin-panel',
    component: AdminPanelComponent,
    canActivate: [authGuard],
  },
  {
    path: 'admin-panel/users',
    component: AdminPanelUsersComponent,
    canActivate: [authGuard],
  },
  {
    path: 'admin-panel/companies',
    component: AdminPanelComapniesComponent,
    canActivate: [authGuard],
  },
  {
    path: 'admin-panel/companies/save',
    component: AddCompanyComponent,
    canActivate: [authGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
