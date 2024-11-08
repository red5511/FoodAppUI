import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { Chart } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { DropdownModule } from 'primeng/dropdown';

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
  dateRangeOptions: any;
  dateRangeValue = 'week';
  customDateRange = ""


  // Calendar stuff
  showCalendar = false;
  selectedDates?: Date[];    // Only 2 entries

  constructor() {
    this.updateCustomDatePeriodOption('Własny zakres')
    // Initialize chart options
    this.chartOptions = {
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: 'Dni', // Title for the X-axis
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
    // Load initial data
    this.loadOrderData(this.selectedRange);
  }

  onDateRangeOptionClick(option: any) {
    if (option.value === "custom") {
      this.showCalendar = true;
    }
  }

  // Handle date range change
  onDateRangeChange(event: Event): void {
    console.log(event)
    const target = event?.target as HTMLSelectElement; // Type assertion to HTMLSelectElement
    this.selectedRange = target.value; // Safe to access value
    console.log(target.value)
    this.loadOrderData(this.selectedRange);
  }

  // Load data based on selected range
  loadOrderData(range: string): void {
    // Update the data based on the selected range
    switch (range) {
      case 'day':
        this.chartData.datasets[0].data = [4, 66, 11, 1, 0, 0, 0, 4, 66, 11, 1, 0, 0, 0, 4, 66, 11, 1, 0, 0, 0, 4, 66, 11, 1, 0, 0, 0, 4, 66, 11, 1, 0, 0, 0, 4, 66, 11, 1, 0, 0, 0, 4, 66, 11, 1, 0, 0, 0, 4, 66, 11, 1, 0, 0, 0, 4, 66, 11, 1, 0, 0, 0, 4, 66, 11, 1, 0, 0, 0, 4, 66, 11, 1, 0, 0, 0, 4, 66, 11, 1, 0, 0, 0, 4, 66, 11, 1, 0, 0, 0, 4, 66, 11, 1, 0, 0, 0, 4, 66, 11, 1, 0, 0, 0, 4, 66, 11, 1, 0, 0, 0]; // Example data for a day


        this.chartData.labels = ['11', '12', '13', '14', '15', '16', '17', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela', '11', '12', '13', '14', '15', '16', '17', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela'];
        break;
      case 'week':
        this.chartData.datasets[0].data = [70, 120, 90, 140, 200, 110, 90]; // Example data for a week
        this.chartData.labels = ['Tydzień 1', 'Tydzień 2', 'Tydzień 3', 'Tydzień 4'];
        break;
      case 'month':
        console.log('workds!')
        this.chartData.datasets[0].data = [300, 400, 350]; // Example data for a month
        this.chartData.labels = ['Styczeń', 'Luty', 'Marzec'];
        break;
      case 'year':
        this.chartData.datasets[0].data = [1200, 1500, 1300, 1400, 1600]; // Example data for a year
        this.chartData.labels = ['2020', '2021', '2022', '2023'];
        break;
    }
    if (this.chart) {
      this.chart.update();  // Wywołanie aktualizacji wykresu

    }
  }

  onCalendarSelect() {
    if (this.selectedDates?.at(1)) {
      this.showCalendar = false
      this.customDateRange += this.selectedDates.at(1)?.toLocaleDateString() || ''
      this.updateCustomDatePeriodOption(this.customDateRange);
    }
    else if (this.selectedDates?.at(0) !== undefined) {
      this.customDateRange = this.selectedDates.at(0)?.toLocaleDateString() + " / " || ''
      this.updateCustomDatePeriodOption(this.customDateRange);
    }
  }

  updateCustomDatePeriodOption(newCustomValue: string) {
    this.dateRangeOptions = [
      { label: 'This Week', value: 'week' },
      { label: 'This Month', value: 'month' },
      { label: 'This Year', value: 'year' },
      { label: newCustomValue, value: 'custom' }  // Use custom date
    ];
  }
}