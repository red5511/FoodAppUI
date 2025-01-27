/* tslint:disable */
/* eslint-disable */
import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConfiguration, ApiConfigurationParams } from './api-configuration';

import { ProductService } from './services/product.service';
import { AuthenticationService } from './services/authentication.service';
import { AdministrationService } from './services/administration.service';
import { CompanyAdministrationService } from './services/company-administration.service';
import { WebSocketService } from './services/web-socket.service';
import { StatisticsService } from './services/statistics.service';
import { ProductPropertiesService } from './services/product-properties.service';
import { ProductCategoryService } from './services/product-category.service';
import { OrderService } from './services/order.service';
import { DevelopmentService } from './services/development.service';
import { DashboardService } from './services/dashboard.service';
import { UserAdministrationService } from './services/user-administration.service';
import { DemoControllerService } from './services/demo-controller.service';

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
    CompanyAdministrationService,
    WebSocketService,
    StatisticsService,
    ProductPropertiesService,
    ProductCategoryService,
    OrderService,
    DevelopmentService,
    DashboardService,
    UserAdministrationService,
    DemoControllerService,
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
