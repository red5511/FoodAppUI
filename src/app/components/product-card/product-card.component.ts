import { Component, Input } from '@angular/core';
import { ProductDto, ProductPropertyDto } from '../../services/models';
import { CartService } from '../../services/cart/cart-service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  @Input({ required: true })
  productsByCategory!: { [key: string]: Array<ProductDto> };
  isChoosePropertiesDialogVisible: boolean = false;
  selectedProduct!: ProductDto;
  selectedProperties: { [key: number]: ProductPropertyDto } = {}; // Stores selected radio button values
  selectedOptionalProperties: { [key: number]: { [key: number]: boolean } } =
    {};
  productForm!: FormGroup;

  constructor(private cartService: CartService, private fb: FormBuilder) {}

  initializeOptionalProperties() {
    if (this.selectedProduct?.productPropertiesList) {
      this.selectedProduct.productPropertiesList.forEach((property) => {
        if (!this.selectedOptionalProperties[property.id!]) {
          this.selectedOptionalProperties[property.id!] = {}; // Initialize property object
        }
        property.propertyList?.forEach((option) => {
          this.selectedOptionalProperties[property.id!][option.id!] = false; // Default value
        });
      });
    }
  }

  initializeForm() {
    if (this.selectedProduct) {
      this.productForm = this.fb.group({});
  
      this.selectedProduct.productPropertiesList?.forEach((property: any) => {
        if (property.required) {
          this.productForm.addControl(
            `property_${property.id}`,
            this.fb.control('', Validators.required) // Add required validation for radio buttons
          );
        }
      });
    }
  }

  getCategoryKeys(productsByCategory: {
    [key: string]: Array<ProductDto>;
  }): string[] {
    return Object.keys(productsByCategory);
  }

  startAddingToCart(product: ProductDto) {
    if (product.productPropertiesList?.length === 0) {
      this.cartService.addToCart(product);
    } else {
      this.selectedProduct = product;
      this.initializeOptionalProperties();
      this.initializeForm();
      this.isChoosePropertiesDialogVisible = true;
    }
  }

  addToCart() {
    console.log(this.productForm);
    
    if (this.productForm.valid) {
      this.isChoosePropertiesDialogVisible = false;
      this.cartService.addToCart(this.selectedProduct);
    } else {
      console.log('Form is invalid');
      this.productForm.markAllAsTouched(); // Mark all controls as touched to show validation errors
    }
  }
}
