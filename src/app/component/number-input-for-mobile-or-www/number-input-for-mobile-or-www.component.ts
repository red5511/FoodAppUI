import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-number-input-for-mobile-or-www',
  templateUrl: './number-input-for-mobile-or-www.component.html',
  styleUrl: './number-input-for-mobile-or-www.component.scss',
})
export class NumberInputForMobileOrWwwComponent {
  @Input({ required: true })
  value!: number;
  @Input()
  min: number = 0;
  @Input()
  max: number = 999;

  @Output()
  onQuantityChange: EventEmitter<number> = new EventEmitter<number>();
}
