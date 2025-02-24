import { Component, Input } from '@angular/core';
import {
  CartSummaryModel,
  OrderProcessOption,
  WHAT_TO_DO_CODES,
} from '../../common/commonModels';
import { BluetoothService } from '../../services/bluetooth/bluetooth-service';
import { Capacitor } from '@capacitor/core';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-cart-final-summary-second-panel',
  templateUrl: './cart-final-summary-second-panel.component.html',
  styleUrl: './cart-final-summary-second-panel.component.scss',
})
export class CartFinalSummarySecondPanelComponent {
  @Input()
  cartSummaryModel!: CartSummaryModel;
  setTimeDialogvisible: boolean = false;
  items: OrderProcessOption[] = [];
  isWeb: boolean = Capacitor.getPlatform() === 'web';
  private destroy$ = new Subject<void>();

  constructor(private bluetoothService: BluetoothService) {}

  ngOnInit(): void {
    this.bluetoothService.bluetoothSubjectVisibility$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isConnected) => {
        this.createItemsToDo();
      });
    this.cartSummaryModel.executionDateTime = new Date();
    console.log('EHHHHHHHHH');
    console.log(Capacitor.getPlatform());
    console.log(!this.isWeb);
    console.log(this.bluetoothService.getConnectedDeviceId() === null);

    this.createItemsToDo();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  createItemsToDo() {
    this.items = [
      {
        name: 'Drukuj',
        code: 'BON_PRINT',
        active: false,
        warning:
          this.isWeb || this.bluetoothService.getConnectedDeviceId() === null,
        warningText: ' (Brak drukarki)',
        disabled:
          this.isWeb || this.bluetoothService.getConnectedDeviceId() === null,
      },
      {
        name: 'Fiskalizuj',
        code: 'KASA_FISKALNA',
        active: false,
        warningText: ' (Brak kasy fiskalnej)',
        disabled: true,
        warning: true,
      },
      {
        name: 'Oznacz zamówienie jako zakończone',
        code: 'MARK_ORDER_AS_EXECUTED',
        active: false,
      },
    ];
  }

  onSelectItem(
    item: OrderProcessOption,
    isDisabled: undefined | boolean
  ): void {
    if (isDisabled && isDisabled === true) {
      return;
    }
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
