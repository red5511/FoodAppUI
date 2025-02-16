import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart/cart-service';
import { OrderProductDto } from '../../services/models';
import { Subject, takeUntil } from 'rxjs';
import { CartModel } from '../../common/commonModels';

@Component({
  selector: 'app-cart-footer',
  templateUrl: './cart-footer.component.html',
  styleUrl: './cart-footer.component.scss',
})
export class CartFooterComponent {
  @Input()
  isBodyCartRightBar!: boolean;
  totalItems: number = 0;
  totalPrice: number = 0;
  isOrderingPage: boolean = false;
  isGlowing: boolean = false; // Flag to control the glow effect
  isGlowActive: boolean = false; // Flag to track if glow is currently active
  isSummaryPanelVisible: boolean = false;
  cartModel?: CartModel;
  private destroy$ = new Subject<void>();

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.cartService.cartUpdated
      .pipe(takeUntil(this.destroy$))
      .subscribe((cart) => {
        this.cartModel = cart;
        this.totalItems =
          this.cartModel?.orderProducts.reduce(
            (sum, item) => sum + (item.quantity || 0),
            0
          ) ?? 0;
        this.totalPrice =
          this.cartModel?.orderProducts.reduce(
            (sum, item) => sum + (item.price || 0),
            0
          ) ?? 0;

        this.triggerGlow();
      });

    this.router.events.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.isOrderingPage = this.router.url.includes('/restaurant-order');
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  clearCart() {
    this.cartService.clearCart();
  }

  onSummaryClick() {
    this.isSummaryPanelVisible = true;
    console.log('onSummaryClick');
    console.log(this.cartModel);
  }

  isVisible() {
    return this.isOrderingPage && this.totalItems > 0;
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
