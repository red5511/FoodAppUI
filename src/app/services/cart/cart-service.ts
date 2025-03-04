import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  OrderDto,
  OrderProductDto,
  ProductPropertiesDto,
  ProductPropertyDto,
} from '../models';
import { CartModel } from '../../common/commonModels';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart = new BehaviorSubject<CartModel>({ orderProducts: [] });
  cartUpdated = this.cart.asObservable();

  addToCartForDelivery(partiallOrder: OrderDto) {
    var newCart: CartModel = {
      deliveryPrice: partiallOrder.deliveryPrice,
      isDelivery: partiallOrder.delivery,
      orderProducts: partiallOrder.orderProducts ?? [],
      isModification: !!partiallOrder.id,
      deliveryAddress: partiallOrder.deliveryAddress,
      modifiedOrderId: partiallOrder.id
    };
    console.log(newCart);

    this.cart.next(newCart);
  }

  addToCart(
    orderProduct: OrderProductDto,
    partiallOrder: OrderDto | undefined = undefined
  ) {
    const currentCart = this.cart.value;

    currentCart.isTakeawayOption = partiallOrder?.takeaway;
    // If cart is empty, set the modifiedOrderId for the first item
    if (currentCart.orderProducts.length === 0) {
      currentCart.modifiedOrderId = partiallOrder?.id;
    }

    // Check if the item already exists based on product ID & selected properties
    const existingItem = currentCart.orderProducts.find(
      (item) =>
        item.product?.id === orderProduct.product?.id &&
        // item.id === orderProduct.id &&
        this.areSelectedPropertiesEqual(
          item.productPropertiesList, // Flat list of ProductPropertyDto
          orderProduct.productPropertiesList // Flat list of ProductPropertyDto
        )
    );

    if (existingItem) {
      existingItem.quantity! += orderProduct.quantity!;
      existingItem.price! += orderProduct.price!;
    } else {
      currentCart.orderProducts.push({
        ...orderProduct,
        quantity: orderProduct.quantity,
      });
    }

    this.cart.next({ ...currentCart });
    console.log(currentCart);
  }

  removeFromCart(orderProductId: number) {
    const updatedCart = {
      ...this.cart.value,
      orderProducts: this.cart.value.orderProducts.filter(
        (item) => item.id !== orderProductId
      ),
    };

    // Reset modifiedOrderId if cart becomes empty
    if (updatedCart.orderProducts.length === 0) {
      updatedCart.modifiedOrderId = undefined;
    }

    this.cart.next(updatedCart);
  }

  updateItem(orderProduct: OrderProductDto) {
    const updatedCart = {
      ...this.cart.value,
      orderProducts: this.cart.value.orderProducts.map((item) =>
        item.id === orderProduct.id ? { ...item, ...orderProduct } : item
      ),
    };
    this.cart.next(updatedCart);
  }

  clearCart() {
    this.cart.next({ orderProducts: [], modifiedOrderId: undefined });
  }

  areSelectedPropertiesEqual(
    list1?: Array<ProductPropertiesDto>,
    list2?: Array<ProductPropertiesDto>
  ): boolean {
    if (!list1 || !list2) return false;

    const ids1 = list1.map((item) => item.id).sort();
    const ids2 = list2.map((item) => item.id).sort();
    const areIdsEqual = ids1.every((id, index) => id === ids2[index]);

    if (!areIdsEqual) {
      return false;
    }

    // Flatten each list to get an array of actual properties.
    const flatList1 = list1.flatMap((group) => group.propertyList ?? []);
    const flatList2 = list2.flatMap((group) => group.propertyList ?? []);

    if (flatList1.length !== flatList2.length) return false;

    // Compare every property in flatList1 to see if there's a matching property in flatList2.
    const areEqual =
      flatList1.every((prop1) =>
        flatList2.some(
          (prop2) =>
            prop1.id === prop2.id &&
            prop1.price === prop2.price &&
            prop1.productPropertiesId === prop2.productPropertiesId
        )
      ) &&
      flatList2.every((prop2) =>
        flatList1.some(
          (prop1) =>
            prop2.id === prop1.id &&
            prop2.price === prop1.price &&
            prop2.productPropertiesId === prop1.productPropertiesId
        )
      );

    return areEqual;
  }

  setTakeawayOption(enableTakeawayOption: boolean) {
    const updatedCart = {
      ...this.cart.value,
      isTakeawayOption: enableTakeawayOption,
    };
    this.cart.next(updatedCart);
  }

  isTakeaway(): boolean {
    return this.cart.value.isTakeawayOption ?? false;
  }

  markCartAsModification() {
    const updatedCart = {
      ...this.cart.value,
      isModification: true,
    };
    this.cart.next(updatedCart);
  }
}
