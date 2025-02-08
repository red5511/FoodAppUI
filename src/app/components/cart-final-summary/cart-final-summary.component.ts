import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OrderProductDto } from '../../services/models';
import { CartService } from '../../services/cart/cart-service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-cart-final-summary',
  templateUrl: './cart-final-summary.component.html',
  styleUrl: './cart-final-summary.component.scss',
})
export class CartFinalSummaryComponent {
  @Input({ required: true })
  isSummaryPanelVisible!: boolean;
  @Output()
  onSummaryPanelVisibleChange: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  cartItems: OrderProductDto[] = [];
  totalItems: number = 0;
  totalPrice: number = 0;
  private destroy$ = new Subject<void>();

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.cartUpdated
      .pipe(takeUntil(this.destroy$))
      .subscribe((cart) => {
        this.cartItems = cart;
        this.totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        this.totalPrice = cart.reduce((sum, item) => sum + item.price, 0);
        console.log('cartItems');
        console.log(this.cartItems);
      });
  }

  closeDialog() {
    this.onSummaryPanelVisibleChange.emit(this.isSummaryPanelVisible);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onQuantityChange(item: OrderProductDto) {
    if (item.quantity === 0) {
      this.cartService.removeFromCart(item.id!);
    } else {
      const updatedItem = this.updateOrderProductPrice(item)
      this.cartService.updateItem(updatedItem);
    }
  }

  updateOrderProductPrice(orderProduct: OrderProductDto): OrderProductDto {
    // Base product price (if any)
    const basePrice = orderProduct.product?.price || 0;
  
    // Sum all the prices from the propertyList items (if they exist)
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
  
    // Use a default quantity of 1 if not provided.
    const quantity = orderProduct.quantity || 1;
  
    // Calculate the final price:
    // (base price + extra properties price) multiplied by quantity.
    const totalPrice = (basePrice + extraPrice) * quantity;
    console.log('totalPrice')
    console.log(totalPrice)
    // Return a new OrderProductDto object with the updated price
    return { ...orderProduct, price: totalPrice };
  }
}
