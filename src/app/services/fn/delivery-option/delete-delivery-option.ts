/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';


export interface DeleteDeliveryOption$Params {
  companyId: number;
  deliveryOptionId: number;
}

export function deleteDeliveryOption(http: HttpClient, rootUrl: string, params: DeleteDeliveryOption$Params, context?: HttpContext): Observable<StrictHttpResponse<void>> {
  const rb = new RequestBuilder(rootUrl, deleteDeliveryOption.PATH, 'delete');
  if (params) {
    rb.path('companyId', params.companyId, {});
    rb.path('deliveryOptionId', params.deliveryOptionId, {});
  }

  return http.request(
    rb.build({ responseType: 'text', accept: '*/*', context })
  ).pipe(
    filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
    map((r: HttpResponse<any>) => {
      return (r as HttpResponse<any>).clone({ body: undefined }) as StrictHttpResponse<void>;
    })
  );
}

deleteDeliveryOption.PATH = '/api/v1/delivery-option/delete/{companyId}/{deliveryOptionId}';
