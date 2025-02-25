/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseService } from '../base-service';
import { ApiConfiguration } from '../api-configuration';
import { StrictHttpResponse } from '../strict-http-response';

import { autocomplete } from '../fn/maps/autocomplete';
import { Autocomplete$Params } from '../fn/maps/autocomplete';
import { placeDetails } from '../fn/maps/place-details';
import { PlaceDetails$Params } from '../fn/maps/place-details';

@Injectable({ providedIn: 'root' })
export class MapsService extends BaseService {
  constructor(config: ApiConfiguration, http: HttpClient) {
    super(config, http);
  }

  /** Path part for operation `placeDetails()` */
  static readonly PlaceDetailsPath = '/api/v1/maps/details';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `placeDetails()` instead.
   *
   * This method doesn't expect any request body.
   */
  placeDetails$Response(params: PlaceDetails$Params, context?: HttpContext): Observable<StrictHttpResponse<{
}>> {
    return placeDetails(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `placeDetails$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  placeDetails(params: PlaceDetails$Params, context?: HttpContext): Observable<{
}> {
    return this.placeDetails$Response(params, context).pipe(
      map((r: StrictHttpResponse<{
}>): {
} => r.body)
    );
  }

  /** Path part for operation `autocomplete()` */
  static readonly AutocompletePath = '/api/v1/maps/autocomplete';

  /**
   * This method provides access to the full `HttpResponse`, allowing access to response headers.
   * To access only the response body, use `autocomplete()` instead.
   *
   * This method doesn't expect any request body.
   */
  autocomplete$Response(params: Autocomplete$Params, context?: HttpContext): Observable<StrictHttpResponse<{
}>> {
    return autocomplete(this.http, this.rootUrl, params, context);
  }

  /**
   * This method provides access only to the response body.
   * To access the full response (for headers, for example), `autocomplete$Response()` instead.
   *
   * This method doesn't expect any request body.
   */
  autocomplete(params: Autocomplete$Params, context?: HttpContext): Observable<{
}> {
    return this.autocomplete$Response(params, context).pipe(
      map((r: StrictHttpResponse<{
}>): {
} => r.body)
    );
  }

}
