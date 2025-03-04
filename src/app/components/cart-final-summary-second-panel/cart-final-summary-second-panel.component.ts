import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  CartSummaryModel,
  OrderProcessOption,
  WHAT_TO_DO_CODES,
} from '../../common/commonModels';
import { BluetoothService } from '../../services/bluetooth/bluetooth-service';
import { Capacitor } from '@capacitor/core';
import { Subject, takeUntil } from 'rxjs';
import { OrderUtils } from '../../common/orders-utils';
import { CartService } from '../../services/cart/cart-service';

@Component({
  selector: 'app-cart-final-summary-second-panel',
  templateUrl: './cart-final-summary-second-panel.component.html',
  styleUrl: './cart-final-summary-second-panel.component.scss',
})
export class CartFinalSummarySecondPanelComponent {
  @Input()
  cartSummaryModel!: CartSummaryModel;
  @Input()
  isDelivery: undefined | boolean;
  @Input()
  isModification: undefined | boolean;
  @Input()
  isPaymentMethodInvalid: undefined | boolean;
  @Output()
  onPaymentMethodChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  setTimeDialogvisible: boolean = false;
  items: OrderProcessOption[] = [];
  isWeb: boolean = Capacitor.getPlatform() === 'web';
  private destroy$ = new Subject<void>();

  constructor(
    private bluetoothService: BluetoothService,
    public orderUtils: OrderUtils,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.bluetoothService.bluetoothSubjectVisibility$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isConnected) => {
        this.createItemsToDo();
      });
    this.cartSummaryModel.executionDateTime = new Date();

    this.createItemsToDo();
  }

  ngOnChanges(): void {
    if (this.isModification) {
      this.cartSummaryModel.whatToDoCodes.push('MARK_ORDER_AS_ACTIVE');
    }
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
        active:
          this.cartSummaryModel.whatToDoCodes?.includes('BON_PRINT') ?? false,
        warning:
          this.isWeb || this.bluetoothService.getConnectedDeviceId() === null,
        warningText: ' (Brak drukarki)',
        ownDisabled:
          this.isWeb || this.bluetoothService.getConnectedDeviceId() === null,
      },
      {
        name: 'Fiskalizuj',
        code: 'KASA_FISKALNA',
        active:
          this.cartSummaryModel.whatToDoCodes?.includes('KASA_FISKALNA') ??
          false,
        warningText: ' (Brak kasy fiskalnej)',
        ownDisabled: true,
        warning: true,
      },
      {
        name: 'Przenieś zamówienie na listę aktywnych zamówień',
        code: 'MARK_ORDER_AS_ACTIVE',
        active:
          (this.cartSummaryModel.whatToDoCodes?.includes(
            'MARK_ORDER_AS_ACTIVE'
          ) ??
            false) ||
          (this.isModification ?? false),
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

  calculateExtraDeliveryPrice(): number {
    return this.orderUtils.calculateExtraDeliveryPrice(
      this.cartSummaryModel.orderProducts ?? []
    );
  }

  calculateTakeawayPrice(): number {
    return this.orderUtils.calculateTakeawayPrice(
      this.cartSummaryModel.orderProducts ?? []
    );
  }

  onTakeawayRadioClick() {
    this.cartService.setTakeawayOption(
      this.cartSummaryModel.isTakeaway === 'Tak'
    );
    if (this.cartSummaryModel.isTakeaway) {
      var takeawayPrice = this.orderUtils.calculateTakeawayPrice(
        this.cartSummaryModel.orderProducts ?? []
      );
    }
  }
}
