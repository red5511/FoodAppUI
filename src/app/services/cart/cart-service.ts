import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { OrderProductDto, ProductDto } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart = new BehaviorSubject<any[]>([]);
  cartUpdated = this.cart.asObservable();

  addToCart(orderProduct: OrderProductDto) {
    const currentCart = this.cart.value;
    const existingItem = currentCart.find(item => item.id === orderProduct.id);

    if (existingItem) {
      existingItem.quantity = existingItem.quantity + orderProduct.quantity;
    } else {
      currentCart.push({ ...orderProduct, quantity: orderProduct.quantity });
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
