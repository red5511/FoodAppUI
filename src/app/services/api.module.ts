/* tslint:disable */
/* eslint-disable */
import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConfiguration, ApiConfigurationParams } from './api-configuration';

import { ProductService } from './services/product.service';
import { AuthenticationService } from './services/authentication.service';
import { AdministrationService } from './services/administration.service';
import { CompanyService } from './services/company.service';
import { OrderService } from './services/order.service';
import { DemoControllerService } from './services/demo-controller.service';
import { DashboardService } from './services/dashboard.service';
import { UserAdministrationService } from './services/user-administration.service';

/**
 * Module that provides all services and configuration.
 */
@NgModule({
  imports: [],
  exports: [],
  declarations: [],
  providers: [
    ProductService,
    AuthenticationService,
    AdministrationService,
    CompanyService,
    OrderService,
    DemoControllerService,
    DashboardService,
    UserAdministrationService,
    ApiConfiguration
  ],
})
export class ApiModule {
  static forRoot(params: ApiConfigurationParams): ModuleWithProviders<ApiModule> {
    return {
      ngModule: ApiModule,
      providers: [
        {
          provide: ApiConfiguration,
          useValue: params
        }
      ]
    }
  }

  constructor( 
    @Optional() @SkipSelf() parentModule: ApiModule,
    @Optional() http: HttpClient
  ) {
    if (parentModule) {
      throw new Error('ApiModule is already loaded. Import in your base AppModule only.');
    }
    if (!http) {
      throw new Error('You need to import the HttpClientModule in your AppModule! \n' +
      'See also https://github.com/angular/angular/issues/20575');
    }
  }
}
