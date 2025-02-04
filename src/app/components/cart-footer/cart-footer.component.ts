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

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.cartService.cartUpdated.subscribe(cart => {
      this.totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      this.totalPrice = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);
    });

    this.router.events.subscribe(() => {
      this.isOrderingPage = this.router.url === '/restaurant-order';
    });

  }

  clearCart() {
    this.cartService.clearCart(); // Assuming you have a clearCart method in CartService
  }

  isVisible(){
    return this.isOrderingPage && this.totalItems > 0;
  }
}
