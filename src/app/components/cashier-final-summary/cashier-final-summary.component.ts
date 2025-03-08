import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  CartSummaryModel,
  OrderProcessOption,
  WHAT_TO_DO_CODES,
} from '../../common/commonModels';
import { OrderDto } from '../../services/models';
import { OrderUtils } from '../../common/orders-utils';
import { OrderService } from '../../services/services';
import { FinalizeOrder$Params } from '../../services/fn/order/finalize-order';
import { ContextService } from '../../services/context/context.service';
import { ToastrService } from 'ngx-toastr';
import { BluetoothService } from '../../services/bluetooth/bluetooth-service';

@Component({
  selector: 'app-cashier-final-summary',
  templateUrl: './cashier-final-summary.component.html',
  styleUrl: './cashier-final-summary.component.scss',
})
export class CashierFinalSummaryComponent {
  @Input({ required: true })
  isSummaryCashierPanelVisible!: boolean;
  @Input({ required: true })
  order!: OrderDto;
  @Output()
  summaryCashierPanelVisibleChange = new EventEmitter<boolean>();
  priceOrderLabel: string = '';

  summaryModel: CartSummaryModel = { whatToDoCodes: [] };
  items: OrderProcessOption[] = [
    {
      name: 'Nabij na kase fiskalną',
      code: 'KASA_FISKALNA',
      active: false,
    },
  ];

  constructor(
    private orderUtils: OrderUtils,
    private orderService: OrderService,
    private contextService: ContextService,
    private toastService: ToastrService,
    private bluetoothService: BluetoothService
  ) {}

  ngOnInit(): void {
    this.priceOrderLabel = this.order.totalPrice!.toFixed(2) + ' zł';
    if (this.order.takeaway) {
      this.summaryModel.isTakeaway = this.order.takeaway ? 'Tak' : 'Nie';
    }
    if (this.order.paymentMethod) {
      this.summaryModel.paymentMethod =
        this.order.paymentMethod === 'CASH' ? 'Gotówka' : 'Karta';
    }
  }

  onSelectItem(item: OrderProcessOption): void {
    // Toggle the active state
    item.active = !item.active;

    // Ensure whatToDoCodes is initialized
    if (!this.summaryModel.whatToDoCodes) {
      this.summaryModel.whatToDoCodes = [];
    }

    if (item.active) {
      // Add the code if it isn't already in the list
      if (
        !this.summaryModel.whatToDoCodes.includes(item.code as WHAT_TO_DO_CODES)
      ) {
        this.summaryModel.whatToDoCodes.push(item.code as WHAT_TO_DO_CODES);
      }
    } else {
      // Remove the code by filtering it out
      this.summaryModel.whatToDoCodes = this.summaryModel.whatToDoCodes.filter(
        (code) => code !== item.code
      );
    }
  }

  closeDialog(refreshOrders: boolean = false) {
    this.isSummaryCashierPanelVisible = false;
    this.summaryCashierPanelVisibleChange.emit(refreshOrders);
  }

  onApprove() {
    const paymentMethod = this.orderUtils.getPaymentMethodFromCheckbox(
      this.summaryModel.paymentMethod
    );
    const takeaway = this.summaryModel.isTakeaway === 'Tak' ? true : false;
    const params: FinalizeOrder$Params = {
      companyId: this.contextService.getCompanyId() ?? -999,
      orderId: this.order.id!,
      body: {
        paymentMethod,
        takeaway,
        newTotalPrice: this.calcNewTotalPrice(),
      },
    };
    this.orderService.finalizeOrder(params).subscribe({
      next: () => {
        this.toastService.success('Zamówienie #' + this.order.displayableId  +' zostało zrealizowane');
        this.closeDialog(true);
      },
    });
  }

  calculateTakeawayPrice(): number {
    return this.orderUtils.calculateTakeawayPrice(
      this.order.orderProducts ?? []
    );
  }

  onTakeawayRadioClick() {
    this.priceOrderLabel = this.calcNewTotalPrice().toFixed(2) + ' zł';
  }

  calcNewTotalPrice(): number {
    if (this.order.takeaway) {
      if (this.summaryModel.isTakeaway === 'Tak') {
        return this.order.totalPrice!;
      } else {
        var takeawayPrice = this.orderUtils.calculateTakeawayPrice(
          this.order.orderProducts ?? []
        );
        return this.order.totalPrice! - takeawayPrice;
      }
    } else {
      if (this.summaryModel.isTakeaway === 'Tak') {
        var takeawayPrice = this.orderUtils.calculateTakeawayPrice(
          this.order.orderProducts ?? []
        );
        return this.order.totalPrice! + takeawayPrice;
      } else {
        return this.order.totalPrice!;
      }
    }
  }
}
