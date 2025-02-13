import { DatePipe } from '@angular/common';

export function calculateMinutesDifferenceCeil(dateString: string): number {
  const inputDate = new Date(dateString);
  const currentDate = new Date();

  const timeDifference = inputDate.getTime() - currentDate.getTime();
  let minutesDifference = Math.ceil(timeDifference / (1000 * 60));

  if (minutesDifference < 0) {
    minutesDifference = 0;
  }

  return minutesDifference;
}

export function calculateSecondsDifferenceFloor(dateString: string): number {
  const inputDate = new Date(dateString);
  const currentDate = new Date();

  const timeDifference = inputDate.getTime() - currentDate.getTime();
  let minutesDifference = Math.floor(timeDifference / 1000);

  if (minutesDifference < 0) {
    minutesDifference = 0;
  }

  return minutesDifference;
}

export function countMinutesLeft(value: number): string {
  if (value === 0) {
    return '0min';
  }

  const hours = Math.floor(value / 60); // Get the number of hours
  const minutes = value % 60; // Get the remaining minutes

  let result = '';

  // Add hours if applicable
  if (hours > 0) {
    result += `${hours}h `;
  }

  // Add minutes if applicable
  if (minutes > 0) {
    result += `${minutes}min`;
  }

  return result.trim();
}

export function toNormalLocalDateTime(date: Date) {
  const datePipe = new DatePipe('en-US');
  const formattedDate = datePipe.transform(
    date,
    'yyyy-MM-ddTHH:mm:ss',
    'Europe/Warsaw' // Explicitly enforce CET timezone
  );

  // Send `formattedDate` to your API (e.g., "2025-02-12T21:42:48")
  return formattedDate;
}
