import { Component } from '@angular/core';

@Component({
  selector: 'app-new-product-add-new-property',
  templateUrl: './new-product-add-new-property.component.html',
  styleUrl: './new-product-add-new-property.component.scss'
})
export class NewProductAddNewPropertyComponent {
  productPropertiesReqired: boolean = false;
  isNewProductPropertiesButtonVisible: boolean = false;
  newCategoryInput: string = '';

  onNewProductPropertiesClick() {
    this.isNewProductPropertiesButtonVisible =
      !this.isNewProductPropertiesButtonVisible;
  }
}
