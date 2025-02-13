import { Component, Input } from '@angular/core';
import {
  OrderProductDto,
  ProductDto,
  ProductPropertiesDto,
  ProductPropertyDto,
} from '../../services/models';
import { CartService } from '../../services/cart/cart-service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImageService } from '../../services/images/Image-service';

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
  formSubmitted: boolean = false; // Custom property to track form submission
  quantity: number = 1; // Default quantity

  constructor(
    private cartService: CartService,
    private fb: FormBuilder,
    public  imageService: ImageService
  ) {}

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
            this.fb.control(null, Validators.required) // Use null instead of ''
          );
        } else {
          property.propertyList?.forEach((option: any) => {
            const controlName = `optional_${property.id}_${option.id}`;
            this.productForm.addControl(controlName, this.fb.control(false));
          });
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
    this.selectedProduct = product;
    this.initializeForm();
    this.isChoosePropertiesDialogVisible = true;
  }

  addToCart() {
    this.formSubmitted = true; // Set to true when form is submitted
    this.productForm.markAllAsTouched(); // Mark all controls as touched

    if (this.productForm.valid) {
      this.isChoosePropertiesDialogVisible = false;
      const orderProduct: OrderProductDto = {
        id: Math.floor(Math.random() * 100000000000), // generuje fakowe id na potrzeby dzialania koszyka, backend je nadpisze
        price: this.calculateTotalPrice(),
        product: this.selectedProduct,
        quantity: this.quantity,
        productPropertiesList: this.getSelectedProductProperties(),
      };
      console.log(orderProduct);

      this.cartService.addToCart(orderProduct);
      this.formSubmitted = false;
    } else {
      console.log('Form is invalid');
    }
  }

  calculateTotalPrice() {
    let totalPrice = this.selectedProduct.price!;

    // Iterate over selected properties (radio buttons)
    this.selectedProduct.productPropertiesList?.forEach((property) => {
      if (property.required) {
        const selectedOptionId = this.productForm.get(
          `property_${property.id}`
        )?.value;
        const selectedOption = property.propertyList!.find(
          (option) => option.id === selectedOptionId
        );
        if (selectedOption) {
          totalPrice += selectedOption.price!; // Add the price of the selected option
        }
      } else {
        // Iterate over optional properties (checkboxes)
        property.propertyList?.forEach((option) => {
          const controlName = `optional_${property.id}_${option.id}`;
          if (this.productForm.get(controlName)?.value) {
            totalPrice += option.price!; // Add price if checkbox is checked
          }
        });
      }
    });

    console.log('calculateTotalPrice');
    console.log(totalPrice);
    console.log(this.quantity);
    console.log(totalPrice);

    totalPrice *= this.quantity;

    return totalPrice;
  }

  getSelectedProductProperties() {
    let productPropertiesList: ProductPropertiesDto[] = [];

    // Iterate over selected properties (radio buttons)
    this.selectedProduct.productPropertiesList?.forEach((property) => {
      if (property.required) {
        const selectedOptionId = this.productForm.get(
          `property_${property.id}`
        )?.value;
        const selectedOption = property.propertyList!.find(
          (option) => option.id === selectedOptionId
        );
        if (selectedOption) {
          productPropertiesList.push(selectedOption);
        }
      } else {
        // Iterate over optional properties (checkboxes)
        property.propertyList?.forEach((option) => {
          const controlName = `optional_${property.id}_${option.id}`;
          if (this.productForm.get(controlName)?.value) {
            productPropertiesList.push(option);
          }
        });
      }
    });

    return productPropertiesList;
  }

  incrementQuantity() {
    if (this.quantity < 10) {
      this.quantity++;
    }
  }

  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  onHide() {
    this.quantity = 1;
  }
}
