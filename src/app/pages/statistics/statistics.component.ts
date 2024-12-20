import { Component, ViewChild } from '@angular/core';
import { ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ContextService } from '../../services/context/context.service';
import {
  CompanyDto,
  DatePeriodModel,
  DateRangeModel,
  GetStatisticsChartRequest,
  GetStatisticsConfigRequest,
  GetStatisticsConfigResponse,
  ProductDto,
} from '../../services/models';
import { StatisticsService } from '../../services/services';
import { filter, map, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { DateResult } from '../../components/calendar-with-dialog/calendar-with-dialog.component';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
})
export class StatisticsComponent {
  // Chart stuff
  @ViewChild(BaseChartDirective) chart!: BaseChartDirective;
  chartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Liczba zamówień',
        fill: true,
        borderColor: 'rgba(255, 165, 0, 1)', // Orange border
        backgroundColor: 'rgba(255, 165, 0, 0.2)', // Light orange fill
        tension: 0.4,
      },
      {
        data: [], // Second dataset
        label: 'Zarobki',
        fill: false,
        borderColor: 'rgba(0, 128, 0, 1)', // Green border
        backgroundColor: 'rgba(0, 128, 0, 0.2)', // Light green fill
        tension: 0.1,
      },
    ],
  };
  chartOptions: any;
  selectedRange = 'day'; // to bedzie do przerobienia
  earningsTotal = 0;
  ordersCountTotal = 0;

  // Filter stuff
  dateRangeOptions!: DateRangeModel[];
  selectedDateRangeValue: any;
  lastSelectedDateRangeValue: any;

  datePeriodOptions!: DatePeriodModel[];
  selectedDatePeriodValue: any;

  productOptions!: ProductDto[];
  selectedProductValue: any;

  companyOptions!: CompanyDto[];
  selectedCompanyValues!: CompanyDto[];

  // Calendar stuff
  selectedDates?: Date[]; // Only 2 entries
  showEarnings = false;

  private destroy$ = new Subject<void>();

  isHolding!: boolean;

  constructor(
    private contextService: ContextService,
    private statisticsService: StatisticsService
  ) {
    this.chartOptions = {
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: 'Przedział', // Title for the X-axis
          },
        },
        y: {
          title: {
            display: true,
            text: 'Liczba zamówień', // Title for the Y-axis
          },
          beginAtZero: true, // Start Y-axis at zero
        },
      },
      plugins: {
        legend: {
          display: true,
          position: 'top', // Position of the legend
        },
      },
    };
  }

  ngOnInit(): void {
    this.contextService
      .getCompanyIdObservable()
      .pipe(
        filter(
          (companyId): companyId is number =>
            companyId !== undefined && companyId !== null
        ),
        tap((companyId) => {
          this.isHolding = this.contextService.isHolding();
          this.companyOptions = this.contextService.getCompanies() ?? [];
        }),
        switchMap((companyId) =>
          this.getConfig(companyId).pipe(
            map(() => companyId) // Return the companyId for the next switchMap
          )
        ),
        takeUntil(this.destroy$) // Use destroy$ for cleanup
      )
      .subscribe({
        next: (companyId) => this.handleGetStatisticsChart(companyId), // Fetch chart data and update the chart
        error: (error) => {
          console.error('Error fetching companyId:', error);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private handleGetStatisticsChart(companyId: number): void {
    let companyIds: number[] =
      this.selectedCompanyValues !== undefined &&
      this.selectedCompanyValues.length > 0
        ? this.selectedCompanyValues.map((company) => company.id)
        : [companyId];
    const body: GetStatisticsChartRequest = {
      companyIds,
      datePeriod: this.selectedDatePeriodValue.datePeriod,
      dateRange: this.selectedDateRangeValue.dateRange,
      dateFrom: this.selectedDates?.at(0)?.toLocaleDateString(),
      dateTo: this.selectedDates?.at(1)?.toLocaleDateString(),
      productId: this.selectedProductValue?.id,
      showEarnings: this.showEarnings,
    };
    this.statisticsService.getStatisticsChart({ body }).subscribe({
      next: (response) => {
        // Update chart data based on the response
        this.ordersCountTotal = response.ordersCountTotal ?? 0;
        this.earningsTotal = response.earningsTotal ?? 0;
        this.chartData.datasets[0].data = response.ordersCount ?? [];
        this.chartData.labels = response.labels ?? [];

        this.chartData.datasets[1].data = response.earnings ?? [];

        this.chart.update(); // Refresh the chart with new data
      },
      error: (error) => {
        console.error('Error in fetching data:', error);
      },
    });
  }

  getConfig(companyId: number) {
    const body: GetStatisticsConfigRequest = {
      companyId: companyId,
    };

    return this.statisticsService.getStatisticsConfig({ body }).pipe(
      tap((response: GetStatisticsConfigResponse) => {
        if (response) {
          this.dateRangeOptions = response.dataRangeModels;
          this.selectedDateRangeValue = structuredClone(response.dataRangeModels.at(0));
          this.datePeriodOptions = response.datePeriodModels;
          this.selectedDatePeriodValue = response.datePeriodModels.at(0);
          this.productOptions = response.products;
          this.selectedProductValue = null;
        }
      })
    );
  }

  datePeriodOptionOnChange() {
    this.handleGetStatisticsChart(this.contextService.getCompanyId() ?? -999); //todo pomysle czy moze jendak tym observablem to lapac
  }

  onCheckboxChange() {
    this.handleGetStatisticsChart(this.contextService.getCompanyId() ?? -999); //todo pomysle czy moze jendak tym observablem to lapac
  }

  productOptionOnChange() {
    this.handleGetStatisticsChart(this.contextService.getCompanyId() ?? -999); //todo pomysle czy moze jendak tym observablem to lapac
  }

  onCompanyOptionChange() {
    this.handleGetStatisticsChart(this.contextService.getCompanyId() ?? -999); //todo pomysle czy moze jendak tym observablem to lapac
  }

  onDateChange(event: DateResult) {
    this.selectedDateRangeValue.dateRange = event.dateRange
    if(event.dateFrom !== undefined && event.dateTo !== undefined){
      this.selectedDates = [event.dateFrom, event.dateTo]
    }
    this.handleGetStatisticsChart(this.contextService.getCompanyId() ?? -999)
  }
}
