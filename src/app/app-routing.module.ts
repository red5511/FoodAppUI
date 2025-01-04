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
    path: 'dashboard2',
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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
