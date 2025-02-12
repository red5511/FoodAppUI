import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OrderProductDto } from '../../services/models';
import { Subject } from 'rxjs/internal/Subject';
import { CartService } from '../../services/cart/cart-service';
import { takeUntil } from 'rxjs';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { CartSummaryModel } from '../../common/commonModels';

@Component({
  selector: 'app-cart-final-summary-first-panel',
  templateUrl: './cart-final-summary-first-panel.component.html',
  styleUrl: './cart-final-summary-first-panel.component.scss',
  animations: [
    trigger('itemAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(35px)' }),
        animate(
          '300ms ease-out',
          style({ opacity: 1, transform: 'translateX(0)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '300ms ease-in',
          style({ opacity: 0, transform: 'translateX(-35px)' })
        ),
      ]),
    ]),
  ],
})
export class CartFinalSummaryFirstPanelComponent {
  @Input()
  cartSummaryModel!: CartSummaryModel;
  @Output()
  onQuantityChangeNoneZero: EventEmitter<boolean> = new EventEmitter<boolean>();

  totalItems: number = 0;
  totalPrice: number = 0;

  private destroy$ = new Subject<void>();

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.cartUpdated
      .pipe(takeUntil(this.destroy$))
      .subscribe((cart) => {
        this.cartSummaryModel.orderProducts = cart;
        this.totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        this.totalPrice = cart.reduce((sum, item) => sum + item.price, 0);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackById(index: number, item: OrderProductDto): number | undefined {
    //potrzebne zeby animacja dzialal porawnie
    return item.id;
  }

  onQuantityChange(item: OrderProductDto) {
    if (item.quantity === 0) {
      this.cartService.removeFromCart(item.id!);
    } else {
      const updatedItem = this.updateOrderProductPrice(item);
      this.cartService.updateItem(updatedItem);

      // Use the glowingStates map to trigger the glow effect
      if (item.id) {
        this.onQuantityChangeNoneZero.emit(true);
      }
    }
  }

  updateOrderProductPrice(orderProduct: OrderProductDto): OrderProductDto {
    const basePrice = orderProduct.product?.price || 0;
    let extraPrice = 0;
    if (orderProduct.productPropertiesList) {
      for (const propGroup of orderProduct.productPropertiesList) {
        if (propGroup.propertyList) {
          for (const prop of propGroup.propertyList) {
            extraPrice += prop.price || 0;
          }
        }
      }
    }
    const quantity = orderProduct.quantity || 1;
    const totalPrice = (basePrice + extraPrice) * quantity;
    return { ...orderProduct, price: totalPrice };
  }
}
