import { Component, Input } from '@angular/core';
import { ProductDto } from '../../services/models';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent {
  @Input({required: true})
  productsByCategory!: { [key: string]: Array<ProductDto>};


  getCategoryKeys(productsByCategory: { [key: string]: Array<ProductDto> }): string[] {
    return Object.keys(productsByCategory);
  }
}
