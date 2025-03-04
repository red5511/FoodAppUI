import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CartSummaryModel } from '../../common/commonModels';

@Component({
  selector: 'app-cart-final-summary-third-panel',
  templateUrl: './cart-final-summary-third-panel.component.html',
  styleUrl: './cart-final-summary-third-panel.component.scss',
})
export class CartFinalSummaryThirdPanelComponent {
  @Input()
  cartSummaryModel!: CartSummaryModel;
  @Input()
  isFormInValid: boolean | undefined;
  @Output()
  deliveryPriceChange: EventEmitter<number> = new EventEmitter<number>();

  onDeliveryPriceChange(value: number): void {
    this.deliveryPriceChange.emit(value);
  }
}
