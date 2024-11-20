/* tslint:disable */
/* eslint-disable */
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { StrictHttpResponse } from '../../strict-http-response';
import { RequestBuilder } from '../../request-builder';

import { GetStatisticsChartRequest } from '../../models/get-statistics-chart-request';
import { GetStatisticsChartResponse } from '../../models/get-statistics-chart-response';

export interface GetStatisticsChart$Params {
  body: GetStatisticsChartRequest;
}

export function getStatisticsChart(
  http: HttpClient,
  rootUrl: string,
  params: GetStatisticsChart$Params,
  context?: HttpContext,
): Observable<StrictHttpResponse<GetStatisticsChartResponse>> {
  const rb = new RequestBuilder(rootUrl, getStatisticsChart.PATH, 'post');
  if (params) {
    rb.body(params.body, 'application/json');
  }

  return http
    .request(
      rb.build({ responseType: 'json', accept: 'application/json', context }),
    )
    .pipe(
      filter((r: any): r is HttpResponse<any> => r instanceof HttpResponse),
      map((r: HttpResponse<any>) => {
        return r as StrictHttpResponse<GetStatisticsChartResponse>;
      }),
    );
}

getStatisticsChart.PATH = '/api/v1/statistics/chart';
