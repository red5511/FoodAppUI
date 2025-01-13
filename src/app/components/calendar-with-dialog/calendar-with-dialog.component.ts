import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DateRangeModel } from '../../services/models';

export interface DateResult {
  dateRange?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

@Component({
  selector: 'app-calendar-with-dialog',
  templateUrl: './calendar-with-dialog.component.html',
  styleUrl: './calendar-with-dialog.component.scss',
})
export class CalendarWithDialogComponent {
  @Input({ required: true })
  dateRangeOptions!: DateRangeModel[];
  @Input({ required: true })
  selectedDateRangeValue: any;
  @Input({ required: true })
  lastSelectedDateRangeValue: any;
  @Output()
  onDateChange: EventEmitter<DateResult> = new EventEmitter();

  showCalendar = false;
  isCalendarClick = false;
  selectedDates?: Date[]; // Only 2 entries
  customDateRange = '';

  onCalendarSelect() {
    if (this.selectedDates?.at(1)) {
      this.showCalendar = false;
      this.customDateRange +=
        this.selectedDates.at(1)?.toLocaleDateString() || '';
      this.updateCustomDatePeriodOption(this.customDateRange);
      this.emitNewValue();
      //this.handleGetStatisticsChart(this.contextService.getCompanyId() ?? -999);
    } else if (this.selectedDates?.at(0) !== undefined) {
      this.customDateRange =
        this.selectedDates.at(0)?.toLocaleDateString() + ' / ' || '';
      this.updateCustomDatePeriodOption(this.customDateRange);
    }
  }

  updateCustomDatePeriodOption(newTranslatedValue: string) {
    this.dateRangeOptions = this.dateRangeOptions.map((option) => {
      if (option.dateRange === 'CUSTOM_DATE_RANGE') {
        this.selectedDateRangeValue = {
          ...option,
          translatedValue: newTranslatedValue,
        }; // potrzebne bo odswieza mi wybana opcje
        return { ...option, translatedValue: newTranslatedValue };
      }
      return option;
    });
  }

  onDateRangeOptionClick() {
    if (
      this.selectedDateRangeValue.dateRange === 'CUSTOM_DATE_RANGE' &&
      this.isCalendarClick
    ) {
      this.showCalendar = true;
    } else if (
      this.lastSelectedDateRangeValue.dateRange !==
      this.selectedDateRangeValue.dateRange
    ) {
      this.emitNewValue();
      //this.handleGetStatisticsChart(this.contextService.getCompanyId() ?? -999); //todo pomysle czy moze jendak tym observablem to lapac
    }
    this.lastSelectedDateRangeValue = this.selectedDateRangeValue;
  }

  emitNewValue() {
    this.onDateChange.emit({
      dateRange: this.selectedDateRangeValue.dateRange,
      dateFrom: this.selectedDates?.at(0),
      dateTo: this.selectedDates?.at(1),
    });
  }

  onHide() {
    this.isCalendarClick = false;
  }
  onShow() {
    this.isCalendarClick = true;
  }
}
