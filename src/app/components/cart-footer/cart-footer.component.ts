import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart/cart-service';

@Component({
  selector: 'app-cart-footer',
  templateUrl: './cart-footer.component.html',
  styleUrl: './cart-footer.component.scss'
})
export class CartFooterComponent {
  totalItems: number = 0;
  totalPrice: number = 0;
  isOrderingPage: boolean = false;
  isGlowing: boolean = false; // Flag to control the glow effect
  isGlowActive: boolean = false; // Flag to track if glow is currently active

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.cartService.cartUpdated.subscribe((cart) => {
      this.totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      this.totalPrice = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);

      // Trigger the glow effect when the cart is updated
      this.triggerGlow();
    });

    this.router.events.subscribe(() => {
      this.isOrderingPage = this.router.url === '/restaurant-order';
    });
  }

  clearCart() {
    this.cartService.clearCart();
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
}