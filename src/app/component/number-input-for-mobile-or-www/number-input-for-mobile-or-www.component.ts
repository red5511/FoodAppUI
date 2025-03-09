import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Capacitor } from '@capacitor/core';

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
  isWeb: boolean = Capacitor.getPlatform() === 'web';

  @Output()
  onQuantityChange: EventEmitter<number> = new EventEmitter<number>();

  increase() {
    if (this.value < this.max) {
      this.value++;
      this.onQuantityChange.emit(this.value);
    }
  }

  decrease() {
    if (this.value > this.min) {
      this.value--;
      this.onQuantityChange.emit(this.value);
    }
  }
}
