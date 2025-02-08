import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  OrderProductDto,
  ProductPropertyDto,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart = new BehaviorSubject<any[]>([]);
  cartUpdated = this.cart.asObservable();

  addToCart(orderProduct: OrderProductDto) {
    const currentCart = this.cart.value;
  
    // Compare PRODUCT ID and SELECTED PROPERTIES
    const existingItem = currentCart.find(item => 
      item.product?.id === orderProduct.product?.id &&
      this.areSelectedPropertiesEqual(
        item.productPropertiesList, // Flat list of ProductPropertyDto
        orderProduct.productPropertiesList // Flat list of ProductPropertyDto
      )
    );
  
    if (existingItem) {
      existingItem.quantity += orderProduct.quantity;
      existingItem.price += orderProduct.price;
    } else {
      currentCart.push({ ...orderProduct, quantity: orderProduct.quantity });
    }
  
    this.cart.next([...currentCart]);
  }

  removeFromCart(orderProductId: number) {
    const updatedCart = this.cart.value.filter((item) => item.id !== orderProductId);
    this.cart.next(updatedCart);
  }

  updateItem(orderProduct: OrderProductDto) {
    this.cart.next(
      this.cart.value.map(item =>
        item.id === orderProduct.id ? { ...item, ...orderProduct } : item
      )
    );
  }
  
  clearCart() {
    this.cart.next([]);
  }

  areSelectedPropertiesEqual(
    list1?: Array<ProductPropertyDto>,
    list2?: Array<ProductPropertyDto>
  ): boolean {
    if (!list1 || !list2) return false;
    if (list1.length !== list2.length) return false;
  
    // Compare ALL properties of the selected items
    return list1.every(prop1 => 
      list2.some(prop2 => 
        prop1.id === prop2.id &&
        prop1.price === prop2.price &&
        prop1.productPropertiesId === prop2.productPropertiesId
      )
    ) && list2.every(prop2 => 
      list1.some(prop1 => 
        prop2.id === prop1.id &&
        prop2.price === prop1.price &&
        prop2.productPropertiesId === prop1.productPropertiesId
      )
    );
  }
}
