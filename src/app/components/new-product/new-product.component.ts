import { Component, Input } from '@angular/core';
import {
  ProductCategoryDto,
  ProductDto,
  ProductPropertiesDto,
} from '../../services/models';

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrl: './new-product.component.scss',
})
export class NewProductComponent {
  @Input({ required: true })
  productCategories!: ProductCategoryDto[];
  @Input({ required: true })
  productPropertiesList!: ProductPropertiesDto[];
  product: ProductDto = {};
  selectedProductCategory: ProductCategoryDto | undefined;
  isNewCategoryButtonVisible: boolean = false;
  newCategoryInput: string = '';

  ngOnInit() {
    console.log('selectedProductCategory');
    console.log(this.selectedProductCategory);
  }
  saveProduct() {
    console.log('clicked');
  }

  onNewCategoryClick() {
    this.isNewCategoryButtonVisible = !this.isNewCategoryButtonVisible;
  }

}
