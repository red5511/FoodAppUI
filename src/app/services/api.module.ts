/* tslint:disable */
/* eslint-disable */
import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ApiConfiguration, ApiConfigurationParams } from './api-configuration';

import { ProductControllerService } from './services/product-controller.service';
import { CompanyControllerService } from './services/company-controller.service';
import { AuthenticationControllerService } from './services/authentication-controller.service';
import { DemoControllerService } from './services/demo-controller.service';

/**
 * Module that provides all services and configuration.
 */
@NgModule({
  imports: [HttpClientModule],
  exports: [],
  declarations: [],
  providers: [
    ProductControllerService,
    CompanyControllerService,
    AuthenticationControllerService,
    DemoControllerService,
    ApiConfiguration,
    HttpClient
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
