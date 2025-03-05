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
import {
  CartModel,
  CartSummaryModel,
  WHAT_TO_DO_CODES,
} from '../../common/commonModels';
import { ContextService } from '../../services/context/context.service';
import { toNormalLocalDateTime } from '../../common/dateUtils';
import { OrderUtils } from '../../common/orders-utils';
import { BluetoothService } from '../../services/bluetooth/bluetooth-service';
import { decodeListOfBase64 } from '../../common/common-utils';
import { Router } from '@angular/router';

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
  cartSummaryModel: CartSummaryModel = {whatToDoCodes: []};
  totalItems: number = 0;
  foodPrice: number = 0;
  extraDeliveryFoodPrice: number = 0;
  totalPrice: number = 0;
  isGlowing: boolean = false;
  isGlowActive: boolean = false;
  isPaymentMethodInvalid: boolean = false;
  isThirdPanelFormInValid: boolean = false;
  isModification: boolean = false;
  isDelivery: boolean | undefined;
  currentStep: number = 1;
  priceOrderLabel = '';
  cartModel?: CartModel;
  private destroy$ = new Subject<void>();

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private toastService: ToastrService,
    private contextSerice: ContextService,
    private orderUtils: OrderUtils,
    private bluetoothService: BluetoothService,
    private router: Router
  ) {
    this.setDefaultCartSummaryModel();
  }

  ngOnInit(): void {
    this.cartService.cartUpdated
      .pipe(takeUntil(this.destroy$))
      .subscribe((cart) => {
        this.cartModel = cart;
        this.isModification = this.cartModel.isModification ?? false
        this.totalItems = cart.orderProducts.reduce(
          (sum: number, item: OrderProductDto) => sum + (item.quantity ?? 0),
          0
        );
        this.foodPrice = cart.orderProducts.reduce(
          (sum: number, item: OrderProductDto) => sum + (item.price ?? 0),
          0
        );
        this.isDelivery = this.cartModel?.isDelivery;
        this.cartSummaryModel.delivery = this.cartModel?.isDelivery
          ? 'Tak'
          : 'Nie';
        this.cartSummaryModel.isTakeaway = this.cartModel?.isDelivery
          ? 'Tak'
          : this.cartSummaryModel.isTakeaway ?? 'Nie';

        this.totalPrice = this.foodPrice;

        if (this.isDelivery) {
          this.extraDeliveryFoodPrice =
            this.orderUtils.calculateExtraDeliveryPrice(cart.orderProducts);
          var tempDeliveryPrice = this.cartSummaryModel.deliveryPrice ?? 0;
          this.cartSummaryModel.deliveryPrice = this.cartModel?.deliveryPrice;
          this.cartSummaryModel.deliveryAddress =
            this.cartModel?.deliveryAddress;

          this.foodPrice += this.extraDeliveryFoodPrice;
          this.totalPrice = this.foodPrice + tempDeliveryPrice;
        } else if (cart.isTakeawayOption) {
          this.foodPrice += this.orderUtils.calculateTakeawayPrice(
            this.cartModel.orderProducts
          );
          this.totalPrice = this.foodPrice;
        }
        this.priceOrderLabel = this.totalPrice.toFixed(2) + ' zł';
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onDeliveryPriceChange(newPrice: number): void {
    var tempDeliveryPrice = this.cartSummaryModel.deliveryPrice ?? 0;
    this.totalPrice = this.foodPrice + tempDeliveryPrice;
    this.priceOrderLabel = this.totalPrice.toFixed(2) + ' zł';
  }

  setDefaultCartSummaryModel() {
    this.cartSummaryModel.executionDateTime = new Date();
    this.cartSummaryModel.paymentMethod = undefined;
    this.cartSummaryModel.whatToDoCodes = [];
  }

  closeDialog() {
    this.onSummaryPanelVisibleChange.emit(this.isSummaryPanelVisible);
    this.currentStep = 1;
    this.isPaymentMethodInvalid = false;
  }

  onApproveOrder(currentStep: number) {
    if (currentStep === 2 && !this.validateSecondStepForm()) {
      return;
    } else if (currentStep === 3 && !this.validateThirdPanelForm()) {
      return;
    }

    if (
      this.cartSummaryModel.whatToDoCodes &&
      this.isThermalPrint(this.cartSummaryModel.whatToDoCodes) &&
      !this.bluetoothService.getConnectedDeviceId()
    ) {
      this.toastService.error(
        'Wybrałeś opcje z wydrukiem, jednak nie masz podpietaj drukarki. Udaj sie do ustawień i dokonaj konfiguracji. Jesli chcesz utworzyć zamówienie bez wydruku odznacz opcje "Drukuj"'
      );
      return;
    }

    if (this.cartModel?.modifiedOrderId) {
      this.modifyOrder();
    } else {
      this.createOrder();
    }
  }

  validateSecondStepForm() {
    if (!this.isOrderExecuted()) {
      return true;
    }
    if (!this.cartSummaryModel.paymentMethod) {
      this.isPaymentMethodInvalid = true;
      return false;
    }
    this.isPaymentMethodInvalid = false;
    return true;
  }

  validateThirdPanelForm() {
    if (
      !this.cartSummaryModel.deliveryAddress?.street ||
      !this.cartSummaryModel.deliveryAddress?.streetNumber
    ) {
      this.isThirdPanelFormInValid = true;
      return false;
    } else {
      this.isThirdPanelFormInValid = false;
      return true;
    }
  }

  onPaymentMethodChanged() {
    if (this.isPaymentMethodInvalid) {
      this.validateSecondStepForm();
    }
  }

  createOrder() {
    const isThermalPrint = this.isThermalPrint(
      this.cartSummaryModel.whatToDoCodes
    );
    const order = this.mapOrder();
    const body: CreateOrderRequest = {
      order,
      printViaBluetooth: isThermalPrint,
    };

    this.orderService
      .saveOrder({ body, companyId: this.contextSerice.getCompanyId() ?? -999 })
      .subscribe({
        next: (response) => {
          this.cartService.clearCart();
          this.toastService.success(
            this.isOrderExecuted()
              ? 'Zamówienie #' +
                  response.displayableOrderId +
                  ' zostało utworzone i zrealizowane'
              : 'Zamówienie #' +
                  response.displayableOrderId +
                  ' zostalo utworzone i jest w realizacji'
          );
          if (this.cartSummaryModel.whatToDoCodes && isThermalPrint) {
            order.displayableId = response.displayableOrderId!;
            const dataListToSend = decodeListOfBase64(
              response.encodedTextForBluetoothPrinterList
            );
            dataListToSend.forEach((data) =>
              this.bluetoothService.sendPrintDataRaw(data)
            );
            // this.bluetoothService.printOrderDetails(order);
          }
          this.isSummaryPanelVisible = false;
          this.setDefaultCartSummaryModel();
          this.router.navigate(['/main']); 
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
        next: (response) => {
          this.isSummaryPanelVisible = false;
          this.cartService.clearCart();
          this.toastService.success(
            this.isOrderExecuted()
              ? 'Zamówienie  #' +
                  response.displayableOrderId +
                  '  zostało zmodyfikowane i zrealizowane'
              : 'Zamówienie  #' +
                  response.displayableOrderId +
                  ' zostalo zmodyfikowane'
          );
          this.setDefaultCartSummaryModel();
          this.router.navigate(['/main']); 
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
      foodPrice: this.foodPrice,
      totalPrice: this.totalPrice,
      takeaway: this.cartSummaryModel.isTakeaway === 'Tak' ? true : false,
      delivery: this.isDelivery,
      deliveryNote: this.cartSummaryModel.deliveryNote,
      deliveryPrice: this.cartModel?.deliveryPrice, //todo do sprawdzenia
      status,
      paidWhenOrdered: this.isOrderExecuted(),
      deliveryAddress: this.cartSummaryModel.deliveryAddress,
    };
  }

  isOrderExecuted() {
    return !this.cartSummaryModel.whatToDoCodes?.includes(
      'MARK_ORDER_AS_ACTIVE'
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

  isThermalPrint(codes: WHAT_TO_DO_CODES[] | undefined) {
    return codes?.includes('BON_PRINT');
  }

  goToThridPanelWithValidation() {
    if (this.validateSecondStepForm()) {
      this.currentStep = 3;
    }
  }
}
