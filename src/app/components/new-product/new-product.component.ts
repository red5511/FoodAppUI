import { Component, Input } from '@angular/core';
import { ProductCategoryDto, ProductDto } from '../../services/models';

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrl: './new-product.component.scss',
})
export class NewProductComponent {
  @Input({required: true})
  productCategories!: ProductCategoryDto[];
  product: ProductDto = {};
  selectedProductCategory: ProductCategoryDto | undefined;

  ngOnInit(){
    console.log('selectedProductCategory')
    console.log(this.selectedProductCategory)
  }
  saveProduct(){
    console.log('clicked')
  }
}
