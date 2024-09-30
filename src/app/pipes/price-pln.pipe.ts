import { CurrencyPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pricePln'
})
export class PricePlnPipe implements PipeTransform {
  transform(value: number | undefined): string {
    if (value == null || isNaN(value)) {
      return '';
    }

    const formattedNumber = new Intl.NumberFormat('pl-PL', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);

    return `${formattedNumber} PLN`;
  }

}
