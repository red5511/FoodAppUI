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
import {
  CreateOrderRequest,
  ModifyOrderRequest,
  OrderDto,
  OrderProductDto,
} from '../../services/models';
import { ToastrService } from 'ngx-toastr';
import { CartModel, CartSummaryModel } from '../../common/commonModels';
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
  cartSummaryModel: CartSummaryModel;
  totalItems: number = 0;
  totalPrice: number = 0;
  isGlowing: boolean = false;
  isGlowActive: boolean = false;
  currentStep: number = 1;
  executeOrderLabel = 'Zatwierdź ';
  cartModel?: CartModel;
  private destroy$ = new Subject<void>();

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private toastService: ToastrService,
    private contextSerice: ContextService,
    private orderUtils: OrderUtils
  ) {
    this.cartSummaryModel = this.getDefaultCartSummaryModel();
  }

  ngOnInit(): void {
    this.cartService.cartUpdated
      .pipe(takeUntil(this.destroy$))
      .subscribe((cart) => {
        this.cartModel = cart;
        this.totalItems = cart.orderProducts.reduce(
          (sum: number, item: OrderProductDto) => sum + (item.quantity ?? 0),
          0
        );
        this.totalPrice = cart.orderProducts.reduce(
          (sum: number, item: OrderProductDto) => sum + (item.price ?? 0),
          0
        );
        this.executeOrderLabel =
          'Zatwierdź - ' + this.totalPrice.toFixed(2) + ' zł';
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getDefaultCartSummaryModel(): CartSummaryModel {
    return {
      isTakeaway: 'Nie',
      orderProducts: [],
      executionDateTime: new Date(),
    };
  }
  closeDialog() {
    this.onSummaryPanelVisibleChange.emit(this.isSummaryPanelVisible);
    this.currentStep = 1;
    this.cartSummaryModel = this.getDefaultCartSummaryModel();
  }

  onApproveOrder() {
    if (this.cartModel?.modifiedOrderId) {
      this.modifyOrder();
    } else {
      this.createOrder();
    }
  }

  createOrder() {
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

  modifyOrder() {
    const body: ModifyOrderRequest = {
      order: this.mapOrder(),
      modifiedOrderIf: this.cartModel?.modifiedOrderId,
    };

    this.orderService
      .modifyOrder({
        body,
        companyId: this.contextSerice.getCompanyId() ?? -999,
      })
      .subscribe({
        next: () => {
          this.isSummaryPanelVisible = false;
          this.cartService.clearCart();
          this.toastService.success(
            this.isOrderExecuted()
              ? 'Zamówienie zostało zmodyfikowane i zrealizowane'
              : 'Zamówienie zostalo zmodyfikowane'
          );
        },
      });
  }

  mapOrder(): OrderDto {
    const status = this.isOrderExecuted() ? 'EXECUTED' : 'IN_EXECUTION';
    const paymentMethod = this.orderUtils.getPaymentMethodFromCheckbox(
      this.cartSummaryModel.paymentMethod
    );

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
      paidWhenOrdered: this.isOrderExecuted(),
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
