import { Component, Input } from '@angular/core';
import {
  OrderProductDto,
  ProductDto,
  ProductPropertiesDto,
  ProductPropertyDto,
} from '../../services/models';
import { CartService } from '../../services/cart/cart-service';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ImageService } from '../../services/images/Image-service';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  @Input({ required: true })
  productsByCategory!: { [key: string]: Array<ProductDto> };
  @Input()
  isDelivery: undefined | null | boolean = false;
  isChoosePropertiesDialogVisible: boolean = false;
  selectedProduct!: ProductDto;
  selectedProperties: { [key: number]: ProductPropertyDto } = {}; // Stores selected radio button values
  selectedOptionalProperties: { [key: number]: { [key: number]: boolean } } =
    {};
  productForm!: FormGroup;
  formSubmitted: boolean = false; // Custom property to track form submission
  quantity: number = 1; // Default quantity
  selectedOptions: { [key: string]: number } = {};


  constructor(
    public cartService: CartService,
    private fb: FormBuilder,
    public imageService: ImageService
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
        if (property.required && (property.maxChosenOptions ?? 0) < 1) {
          // Required single selection (radio button)
          this.productForm.addControl(
            `property_${property.id}`,
            this.fb.control(null, Validators.required)
          );
        } else {
          // Create a FormGroup for required checkbox selection
          const group = this.fb.group({});
          property.propertyList?.forEach((option: any) => {
            const controlName = `optional_${property.id}_${option.id}`;
            group.addControl(controlName, this.fb.control(false));
          });
  
          // Add custom validator for required checkbox group
          if (property.required) {
            group.setValidators([this.atLeastOneCheckboxSelected()]);
          }
  
          this.productForm.addControl(`optionalGroup_${property.id}`, group);
        }
      });
    }
  }

  atLeastOneCheckboxSelected(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const values = Object.values(group.value);
      return values.includes(true) ? null : { required: true };
    };
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
      console.log('xddd');
      console.log(this.getSelectedProductProperties());
      
      const orderProduct: OrderProductDto = {
        id: Math.floor(Math.random() * 100000000000), // generuje fakowe id na potrzeby dzialania koszyka, backend je nadpisze
        price: this.calculateTotalPrice(),
        product: this.selectedProduct,
        quantity: this.quantity,
        productPropertiesList: this.getSelectedProductProperties(),
        extraDeliveryPrice:
          (this.selectedProduct.deliveryPrice ?? 0) * this.quantity,
      };
      this.cartService.addToCart(orderProduct);
      this.formSubmitted = false;
    } else {
      console.log('Form is invalid');
    }
  }

  calculateTotalPrice() {
    let totalPrice = this.selectedProduct.price!;
  
    // Iterate over each property
    this.selectedProduct.productPropertiesList?.forEach((property) => {
      if (property.required) {
        // For radio buttons (required, single selection)
        const selectedOptionId = this.productForm.get(`property_${property.id}`)?.value;
        const selectedOption = property.propertyList!.find(
          (option) => option.id === selectedOptionId
        );
        if (selectedOption) {
          totalPrice += selectedOption.price!;
        }
      } else {
        // For checkboxes (optional selections) inside a nested group
        const group = this.productForm.get('optionalGroup_' + property.id) as FormGroup;
        if (group) {
          property.propertyList?.forEach((option) => {
            const controlName = `optional_${property.id}_${option.id}`;
            if (group.get(controlName)?.value) {
              totalPrice += option.price!;
            }
          });
        }
      }
    });
  
    totalPrice *= this.quantity;
    return totalPrice;
  }
  

  getSelectedProductProperties(): ProductPropertiesDto[] {
    let result: ProductPropertiesDto[] = [];
  
    this.selectedProduct.productPropertiesList?.forEach((property) => {
      const clonedProperties: ProductPropertiesDto = cloneDeep(property);
      clonedProperties.propertyList = [];
  
      if (property.required && (property.maxChosenOptions ?? 0) < 1) {
        // Handle required properties (radio buttons)
        const selectedOptionId = this.productForm.get(`property_${property.id}`)?.value;
        const selectedOption = property.propertyList?.find((option) => option.id === selectedOptionId);
        if (selectedOption) {
          clonedProperties.propertyList.push(selectedOption);
        }
      } else {
        // Handle optional checkboxes (including required checkboxes inside optionalGroup)
        const group = this.productForm.get(`optionalGroup_${property.id}`) as FormGroup;
        if (group) {
          property.propertyList?.forEach((option) => {
            const controlName = `optional_${property.id}_${option.id}`;
            const controlValue = group.get(controlName)?.value;
  
            if (controlValue) {
              clonedProperties.propertyList!.push(option);
            }
          });
        }
      }
  
      if (clonedProperties.propertyList.length > 0) {
        result.push(clonedProperties);
      }
    });
  
    return result;
  }
  
  

  onCheckboxChange(propertyId: number, optionId: number, maxAllowed: number, event: any) {
    // Get the nested FormGroup for the property.
    const group = this.productForm.get('optionalGroup_' + propertyId) as FormGroup;
    const controlName = `optional_${propertyId}_${optionId}`;
    
    if (!this.selectedOptions[propertyId]) {
      this.selectedOptions[propertyId] = 0;
    }
    
    if (event.checked) {
      if (this.selectedOptions[propertyId] < maxAllowed) {
        this.selectedOptions[propertyId]++;
      } else {
        // Update the control within the group.
        group.get(controlName)?.setValue(false);
      }
    } else {
      this.selectedOptions[propertyId]--;
    }
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
