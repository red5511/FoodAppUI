import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CartService } from '../../services/cart/cart-service';
import { OrderProductDto } from '../../services/models';

@Component({
  selector: 'app-cart-footer',
  templateUrl: './cart-footer.component.html',
  styleUrl: './cart-footer.component.scss',
})
export class CartFooterComponent {
  @Input({required: true})
  isBodyCartRightBar!: boolean;
  @Input({required: true})
  totalItems: number = 0;
  @Input({required: true})
  foodPrice: number = 0;
  @Input({required: true})
  deliveryPrice: number | undefined;
  @Output() onSummaryPanelVisibleChange: EventEmitter<boolean> =
  new EventEmitter<boolean>();
  isOrderingPage: boolean = false;
  isGlowing: boolean = false; // Flag to control the glow effect
  isGlowActive: boolean = false; // Flag to track if glow is currently active
  isSummaryPanelVisible: boolean = false;

  constructor(private cartService: CartService) {}

  ngOnChanges(): void {
    this.triggerGlow();
  }

  clearCart() {
    this.cartService.clearCart();
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

  trackById(index: number, item: OrderProductDto): number {
    return item.product!.id!; // Or unique identifier
  }
}
