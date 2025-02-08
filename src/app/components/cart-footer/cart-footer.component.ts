import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart/cart-service';
import { OrderProductDto } from '../../services/models';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-cart-footer',
  templateUrl: './cart-footer.component.html',
  styleUrl: './cart-footer.component.scss',
})
export class CartFooterComponent {
  totalItems: number = 0;
  totalPrice: number = 0;
  isOrderingPage: boolean = false;
  isGlowing: boolean = false; // Flag to control the glow effect
  isGlowActive: boolean = false; // Flag to track if glow is currently active
  isSummaryPanelVisible: boolean = false;
  cartItems: OrderProductDto[] = [];
  private destroy$ = new Subject<void>();

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.cartService.cartUpdated
      .pipe(takeUntil(this.destroy$))
      .subscribe((cart) => {
        this.cartItems = cart;
        this.totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        this.totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

        this.triggerGlow();
      });

    this.router.events.subscribe(() => {
      this.isOrderingPage = this.router.url === '/restaurant-order';
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
    console.log(this.cartItems);
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
