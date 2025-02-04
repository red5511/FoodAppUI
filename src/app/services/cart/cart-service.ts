import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProductDto } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart = new BehaviorSubject<any[]>([]);
  cartUpdated = this.cart.asObservable();

  addToCart(product: ProductDto) {
    const currentCart = this.cart.value;
    const existingItem = currentCart.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity++;
    } else {
      currentCart.push({ ...product, quantity: 1 });
    }

    this.cart.next([...currentCart]);
  }

  removeFromCart(productId: number) {
    const updatedCart = this.cart.value.filter(item => item.id !== productId);
    this.cart.next(updatedCart);
  }

  clearCart(){
    this.cart.next([])
  }
}
