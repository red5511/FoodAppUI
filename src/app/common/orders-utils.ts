import { Injectable } from '@angular/core';
import { ImageService } from '../services/images/Image-service';
import { OrderProductDto, ProductPropertiesDto } from '../services/models';
import { CartService } from '../services/cart/cart-service';

@Injectable({
  providedIn: 'root',
})
export class OrderUtils {
  constructor(private imageService: ImageService, private cartService: CartService) {}
  getStatusSeverity(
    status: string
  ): 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast' {
    switch (status) {
      case 'WAITING_FOR_ACCEPTANCE':
        return 'contrast';
      case 'IN_EXECUTION':
        return 'warning';
      case 'EXECUTED':
        return 'success';
      case 'REJECTED':
        return 'danger';
      case 'READY_FOR_PICK_UP':
        return 'info';
      default:
        return 'contrast';
    }
  }

  isCashPayment(paymentMethod: 'CASH' | 'CARD' | undefined) {
    return 'CASH' === paymentMethod;
  }

  isCardPayment(paymentMethod: 'CASH' | 'CARD' | undefined) {
    return 'CARD' === paymentMethod;
  }

  getProductPropertiesNames(
    productPropertiesList: ProductPropertiesDto[]
  ): string {
    if (!productPropertiesList || productPropertiesList.length === 0) {
      return ' - ';
    }
    
    // Flatten the property names from each group's propertyList.
    const propertyNames = productPropertiesList.reduce((names: string[], group) => {
      if (group.propertyList && group.propertyList.length > 0) {
        // Push each property's name from the current group.
        group.propertyList.forEach(prop => {
          if(prop.name){
            names.push(prop.name)
          }
        });
      }
      return names;
    }, [] as string[]);
  
    return propertyNames.join(', ') || ' - ';
  }

  getImage(imgUrl: string | undefined) {
    if (imgUrl && imgUrl !== 'OWN') {
      return 'images/' + imgUrl + '.png';
    }
    return this.imageService.getProductImageUrl(imgUrl);
  }

  getPaymentMethodFromCheckbox(paymentMethod: 'Gotówka' | 'Karta' | undefined): 'CASH' | 'CARD' | undefined {
    return paymentMethod === 'Gotówka'
      ? 'CASH'
      : paymentMethod === 'Karta'
      ? 'CARD'
      : undefined;
  }

    onQuantityChange(item: OrderProductDto) {
      
      if (item.quantity === 0) {
        this.cartService.removeFromCart(item.id!);
      } else {
        const updatedItem = this.updateOrderProductPrice(item);
        this.cartService.updateItem(updatedItem);
      }
    }

    updateOrderProductPrice(orderProduct: OrderProductDto): OrderProductDto {
      const basePrice = orderProduct.product?.price || 0;
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
      const quantity = orderProduct.quantity || 1;
      const totalPrice = (basePrice + extraPrice) * quantity;
      return { ...orderProduct, price: totalPrice };
    }
}
