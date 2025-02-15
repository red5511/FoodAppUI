import { Component, Input } from '@angular/core';
import {
  CartSummaryModel,
  OrderProcessOption,
  WHAT_TO_DO_CODES,
} from '../../common/commonModels';

@Component({
  selector: 'app-cart-final-summary-second-panel',
  templateUrl: './cart-final-summary-second-panel.component.html',
  styleUrl: './cart-final-summary-second-panel.component.scss',
})
export class CartFinalSummarySecondPanelComponent {
  @Input()
  cartSummaryModel!: CartSummaryModel;
  setTimeDialogvisible: boolean = false;
  items: OrderProcessOption[] = [
    {
      name: 'Wydruk bonowy',
      code: 'BON_PRINT',
      active: false,
    },
    {
      name: 'Nabij na kase fiskalną',
      code: 'KASA_FISKALNA',
      active: false,
    },
    {
      name: 'Oznacz zamówienie jako zakończone',
      code: 'MARK_ORDER_AS_EXECUTED',
      active: false,
    },
  ];

  ngOnInit(): void {
    this.cartSummaryModel.executionDateTime = new Date();
  }

  onSelectItem(item: OrderProcessOption): void {
    // Toggle the active state
    item.active = !item.active;

    // Ensure whatToDoCodes is initialized
    if (!this.cartSummaryModel.whatToDoCodes) {
      this.cartSummaryModel.whatToDoCodes = [];
    }

    if (item.active) {
      // Add the code if it isn't already in the list
      if (
        !this.cartSummaryModel.whatToDoCodes.includes(
          item.code as WHAT_TO_DO_CODES
        )
      ) {
        this.cartSummaryModel.whatToDoCodes.push(item.code as WHAT_TO_DO_CODES);
      }
    } else {
      // Remove the code by filtering it out
      this.cartSummaryModel.whatToDoCodes =
        this.cartSummaryModel.whatToDoCodes.filter(
          (code) => code !== item.code
        );
    }
  }

  onExecutionTimeButtonClick() {
    this.setTimeDialogvisible = true;
  }

  selectedTimeChange(date: Date) {
    this.cartSummaryModel.executionDateTime = date;
  }
}
