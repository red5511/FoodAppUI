import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { CartService } from '../../services/cart/cart-service';
import { Subject, takeUntil } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';
import { OrderService } from '../../services/services';
import { CreateOrderRequest, OrderDto } from '../../services/models';
import { ToastrService } from 'ngx-toastr';
import { CartSummaryModel } from '../../common/commonModels';
import { ContextService } from '../../services/context/context.service';
import { toNormalLocalDateTime } from '../../common/dateUtils';
import { OrderUtils } from '../../common/orders-utils';

@Component({
  selector: 'app-cart-final-summary',
  templateUrl: './cart-final-summary.component.html',
  styleUrls: ['./cart-final-summary.component.scss'],
  animations: [
    trigger('slideAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 1 }),
        animate('0.3s ease', style({ transform: 'translateX(0)', opacity: 1 })),
      ]),
      transition(':leave', [
        animate(
          '0.9s ease',
          style({ transform: 'translateX(-100%)', opacity: 1 })
        ),
      ]),
    ]),
  ],
})
export class CartFinalSummaryComponent implements OnInit, OnDestroy {
  @Input({ required: true }) isSummaryPanelVisible!: boolean;
  @Output() onSummaryPanelVisibleChange: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  cartSummaryModel: CartSummaryModel = {
    isTakeaway: 'Nie',
    orderProducts: [],
    executionDateTime: new Date(),
  };
  totalItems: number = 0;
  totalPrice: number = 0;
  isGlowing: boolean = false;
  isGlowActive: boolean = false;
  currentStep: number = 1;
  executeOrderLabel = 'Zatwierdź ';
  private destroy$ = new Subject<void>();

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private toastService: ToastrService,
    private contextSerice: ContextService,
    private orderUtils: OrderUtils
  ) {}

  ngOnInit(): void {
    this.cartService.cartUpdated
      .pipe(takeUntil(this.destroy$))
      .subscribe((cart) => {
        this.totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        this.totalPrice = cart.reduce((sum, item) => sum + item.price, 0);
        this.executeOrderLabel =
          'Zatwierdź - ' + this.totalPrice.toFixed(2) + ' zł';
      });
  }

  closeDialog() {
    this.onSummaryPanelVisibleChange.emit(this.isSummaryPanelVisible);
    this.currentStep = 1;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onExecuteOrder() {
    const body: CreateOrderRequest = {
      order: this.mapOrder(),
    };

    this.orderService
      .saveOrder({ body, companyId: this.contextSerice.getCompanyId() ?? -999 })
      .subscribe({
        next: () => {
          this.isSummaryPanelVisible = false;
          this.cartService.clearCart();
          this.toastService.success(
            this.isOrderExecuted()
              ? 'Zamówienie zostało utworzone i zrealizowane'
              : 'Zamówienie zostalo utworzone i jest w realizacji'
          );
        },
      });
  }

  mapOrder(): OrderDto {
    const status = this.isOrderExecuted() ? 'EXECUTED' : 'IN_EXECUTION';
    const paymentMethod = this.orderUtils.getPaymentMethodFromCheckbox(this.cartSummaryModel.paymentMethod)

    return {
      executionTime: toNormalLocalDateTime(
        this.cartSummaryModel.executionDateTime!
      )?.toString(),
      description: this.cartSummaryModel.desctiption,
      orderProducts: this.cartSummaryModel.orderProducts,
      paymentMethod,
      price: this.totalPrice,
      takeaway: this.cartSummaryModel.isTakeaway === 'Tak' ? true : false,
      status,
      paidWhenOrdered: this.isOrderExecuted()
    };
  }

  isOrderExecuted() {
    return this.cartSummaryModel.whatToDoCodes?.includes(
      'MARK_ORDER_AS_EXECUTED'
    );
  }

  triggerGlow() {
    if (this.isGlowActive) {
      return; // Do nothing if the glow effect is already active
    }

    this.isGlowActive = true; // Mark glow as active
    this.isGlowing = true; // Start the glow effect

    setTimeout(() => {
      this.isGlowing = false; // Stop the glow effect after 1.5 seconds
      this.isGlowActive = false; // Mark glow as inactive
    }, 1500); // Match the duration of the CSS animation
  }
}
