import { Injectable } from '@angular/core';
import { ImageService } from '../services/images/Image-service';

@Injectable({
  providedIn: 'root',
})
export class OrderUtils {
  constructor(private imageService: ImageService) {}
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
    productPropertiesList: any[] | null | undefined
  ): string {
    if (!productPropertiesList || productPropertiesList.length === 0) {
      return 'Brak';
    }
    return productPropertiesList.map((prop) => prop.name).join(', ');
  }

  getImage(imgUrl: string | undefined) {
    if (imgUrl) {
      return 'images/' + imgUrl + '.png';
    }
    return this.imageService.getProductImageUrl(imgUrl);
  }
}
