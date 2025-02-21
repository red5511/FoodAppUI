/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { connectToDevice } from '../fn/bluetooth-controller-2/connect-to-device';
import { ConnectToDevice$Params } from '../fn/bluetooth-controller-2/connect-to-device';
import { scanDevices } from '../fn/bluetooth-controller-2/scan-devices';
import { ScanDevices$Params } from '../fn/bluetooth-controller-2/scan-devices';

@Injectable({ providedIn: 'root' })
export class BluetoothController2Service extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `scanDevices()` */
  static readonly ScanDevicesPath = '/scan';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `scanDevices()` instead.
   *
   * This method doesn't expect any request body.
   */
  scanDevices$Response(params?: ScanDevices$Params, context?: HttpContext): Observable<StrictHttpResponse<Array<{
'authenticated'?: boolean;
'encrypted'?: boolean;
'trustedDevice'?: boolean;
'bluetoothAddress'?: string;
}>>> {
    return scanDevices(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `scanDevices$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  scanDevices(params?: ScanDevices$Params, context?: HttpContext): Observable<Array<{
'authenticated'?: boolean;
'encrypted'?: boolean;
'trustedDevice'?: boolean;
'bluetoothAddress'?: string;
}>> {
    return this.scanDevices$Response(params, context).pipe(
      map((r: StrictHttpResponse<Array<{
'authenticated'?: boolean;
'encrypted'?: boolean;
'trustedDevice'?: boolean;
'bluetoothAddress'?: string;
}>>): Array<{
'authenticated'?: boolean;
'encrypted'?: boolean;
'trustedDevice'?: boolean;
'bluetoothAddress'?: string;
}> => r.body)
    );
  }

  /** Path part for operation `connectToDevice()` */
  static readonly ConnectToDevicePath = '/connect';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `connectToDevice()` instead.
   *
   * This method doesn't expect any request body.
   */
  connectToDevice$Response(params: ConnectToDevice$Params, context?: HttpContext): Observable<StrictHttpResponse<string>> {
    return connectToDevice(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `connectToDevice$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  connectToDevice(params: ConnectToDevice$Params, context?: HttpContext): Observable<string> {
    return this.connectToDevice$Response(params, context).pipe(
      map((r: StrictHttpResponse<string>): string => r.body)
    );
  }

}
