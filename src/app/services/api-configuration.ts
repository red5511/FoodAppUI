/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';

/**
 * Global configuration
 */
@Injectable({
  providedIn: 'root',
})
export class ApiConfiguration {

  // rootUrl: string = 'http://localhost:8080';
  // rootUrl: string = 'http://10.0.2.2:8080';
  rootUrl: string = 'http://192.168.1.5:8080';
}

/**
 * Parameters for `ApiModule.forRoot()`
 */
export interface ApiConfigurationParams {
  rootUrl?: string;
}
