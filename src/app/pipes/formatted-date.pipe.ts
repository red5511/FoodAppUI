import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formattedDate',
})
export class FormattedDatePipe implements PipeTransform {
  transform(value: string | undefined): string {
    if (!value) {
      return 'Błędna data'; // Handle undefined or empty string
    }

    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return 'Błędna data'; // Handle Błędna data string
    }

    // Format the date to "DD.MM.YYYY"
    const day = String(date.getDate()).padStart(2, '0'); // Get the day and pad with leading zero if needed
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Get the month (0-indexed) and pad with leading zero
    const year = date.getFullYear(); // Get the full year

    return `${day}.${month}.${year}`; // Return the formatted date
  }
}
