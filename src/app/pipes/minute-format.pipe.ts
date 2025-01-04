import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'minuteFormat'
})
export class MinuteFormatPipe implements PipeTransform {

  transform(value: number): string {
    if (value < 0) {
      return 'Invalid time';  // Opcjonalnie: obsługa niepoprawnych danych
    }

    // Obliczamy godziny i minuty
    const hours = Math.floor(value / 60);
    const minutes = value % 60;

    // Tworzymy odpowiedni string
    let result = '';

    if (hours > 0) {
      result += `${hours}h`;
    }
    if (minutes > 0 || hours === 0) {
      result += ` ${minutes}min`;
    }

    return result.trim(); // Zwracamy wynik, usuwając zbędne spacje
  }
}
