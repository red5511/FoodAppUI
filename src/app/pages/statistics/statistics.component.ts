import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { Chart } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { DropdownChangeEvent, DropdownModule } from 'primeng/dropdown';
import { ContextService } from '../../services/context/context.service';
import { DatePeriodModel, DateRangeModel, GetStatisticsChartRequest, GetStatisticsChartResponse, GetStatisticsConfigRequest, GetStatisticsConfigResponse, ProductDto } from '../../services/models';
import { StatisticsService } from '../../services/services';
import { filter, map, Observable, switchMap, tap } from 'rxjs';

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
    datasets: [{
      data: [],
      label: 'Liczba zamówień',
      fill: true
    }]
  };
  chartOptions: any;
  selectedRange = 'day'; // to bedzie do przerobienia

  // Filter stuff
  dateRangeOptions!: DateRangeModel[];
  selectedDateRangeValue: any;
  lastSelectedDateRangeValue: any;
  customDateRange = ""

  datePeriodOptions!: DatePeriodModel[];
  selectedDatePeriodValue: any;

  productOptions!: ProductDto[];
  selectedProductValue: any;

  // Calendar stuff
  showCalendar = false;
  isCalendarClick = false;
  selectedDates?: Date[];    // Only 2 entries

  constructor(private contextService: ContextService, private statisticsService: StatisticsService) {
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
    this.contextService.getCompanyIdObservable()
      .pipe(
        filter((companyId): companyId is number => companyId !== undefined && companyId !== null),
        switchMap(companyId =>
          this.getConfig(companyId).pipe(
            map(() => companyId)  // Return the companyId for the next switchMap
          )
        )
      )
      .subscribe({
        next: (companyId) => this.handleGetStatisticsChart(companyId),  // Fetch chart data and update the chart
        error: (error) => {
          console.error('Error fetching companyId:', error);
        }
      });
  }

  private handleGetStatisticsChart(companyId: number): void {
    const body: GetStatisticsChartRequest = {
      companyId,
      datePeriod: this.selectedDatePeriodValue.datePeriod,
      dateRange: this.selectedDateRangeValue.dateRange,
      dateFrom: this.selectedDates?.at(0)?.toLocaleDateString(),
      dateTo: this.selectedDates?.at(1)?.toLocaleDateString(),
      productId: this.selectedProductValue?.id
    };
    this.statisticsService.getStatisticsChart({ body }).subscribe({
      next: (response) => {
        // Update chart data based on the response
        this.chartData.datasets[0].data = response.data ?? [];
        this.chartData.labels = response.labels ?? [];
        this.chart.update();  // Refresh the chart with new data
      },
      error: (error) => {
        console.error('Error in fetching data:', error);
      }
    });
  }

  getConfig(companyId: number) {
    const body: GetStatisticsConfigRequest = {
      companyIds: [companyId]
    };

    return this.statisticsService.getStatisticsConfig({ body }).pipe(
      tap((response: GetStatisticsConfigResponse) => {
        if (response) {
          this.dateRangeOptions = response.dataRangeModels;
          this.selectedDateRangeValue = response.dataRangeModels.at(0);
          this.lastSelectedDateRangeValue = response.dataRangeModels.at(0);
          this.datePeriodOptions = response.datePeriodModels;
          this.selectedDatePeriodValue = response.datePeriodModels.at(0);
          this.productOptions = response.products;
        }
      })
    );
  }


  onCalendarSelect() {
    if (this.selectedDates?.at(1)) {
      this.showCalendar = false
      this.customDateRange += this.selectedDates.at(1)?.toLocaleDateString() || ''
      this.updateCustomDatePeriodOption(this.customDateRange);
      this.handleGetStatisticsChart(this.contextService.getCompanyId() ?? -999)
    }
    else if (this.selectedDates?.at(0) !== undefined) {
      this.customDateRange = this.selectedDates.at(0)?.toLocaleDateString() + " / " || ''
      this.updateCustomDatePeriodOption(this.customDateRange);
    }


  }

  updateCustomDatePeriodOption(newTranslatedValue: string) {
    this.dateRangeOptions = this.dateRangeOptions.map(option => {
      if (option.dateRange === 'CUSTOM_DATE_RANGE') {
        this.selectedDateRangeValue = { ...option, translatedValue: newTranslatedValue }; // potrzebne bo odswieza mi wybana opcje 
        return { ...option, translatedValue: newTranslatedValue };
      }
      return option;
    });
  }

  datePeriodOptionOnChange() {
    this.handleGetStatisticsChart(this.contextService.getCompanyId() ?? -999) //todo pomysle czy moze jendak tym observablem to lapac
  }

    onDateRangeOptionClick() {
      if (this.selectedDateRangeValue.dateRange === "CUSTOM_DATE_RANGE" && this.isCalendarClick) {
        this.showCalendar = true;
      }
      else if (this.lastSelectedDateRangeValue.dateRange !== this.selectedDateRangeValue.dateRange) {
        this.handleGetStatisticsChart(this.contextService.getCompanyId() ?? -999) //todo pomysle czy moze jendak tym observablem to lapac
      }
      this.lastSelectedDateRangeValue = this.selectedDateRangeValue
    }

    productOptionOnChange(){
      this.handleGetStatisticsChart(this.contextService.getCompanyId() ?? -999) //todo pomysle czy moze jendak tym observablem to lapac
    }

  onHide() {
    this.isCalendarClick = false
  }
  onShow() {
    this.isCalendarClick = true
  }
}