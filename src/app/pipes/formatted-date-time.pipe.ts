import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formattedDateTime'
})
export class FormattedDateTimePipe implements PipeTransform {
  transform(value: string | undefined): string {
    if (!value) {
      return 'Błędna data'; // Handle undefined or empty string
    }

    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return 'Błędna data'; // Handle Błędna data string
    }

    // Format the date to "DD.MM.YYYY"
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    // Format the time to "HH:mm:ss"
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // Combine date and time
    return `${hours}:${minutes} - ${day}.${month}.${year}`;
  }
}
