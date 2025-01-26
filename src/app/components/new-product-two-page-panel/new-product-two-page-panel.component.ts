import { trigger, transition, style, animate } from '@angular/animations';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  ProductCategoryDto,
  ProductPropertiesDto,
} from '../../services/models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-product-two-page-panel',
  templateUrl: './new-product-two-page-panel.component.html',
  styleUrl: './new-product-two-page-panel.component.scss',
  animations: [
    trigger('slideAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 1 }),
        animate('0.3s ease', style({ transform: 'translateX(0)', opacity: 1 })),
      ]),
      transition(':leave', [
        animate(
          '0.9s ease',
          style({ transform: 'translateX(-100%)', opacity: 1 })
        ),
      ]),
    ]),
  ],
})
export class NewProductTwoPagePanelComponent {
  @Input({ required: true })
  productCategories!: ProductCategoryDto[];
  @Input({ required: true })
  productPropertiesList!: ProductPropertiesDto[];
  @Input({ required: true })
  isDialogVisible!: boolean;
  @Output()
  isDialogVisibleChange = new EventEmitter<boolean>();
  isNewCategoryButtonVisible: boolean = false;
  newCategoryInput: string = '';
  selectedProductCategory: ProductCategoryDto | undefined;
  productForm!: FormGroup;

  product = {
    name: '',
    price: null,
    description: '',
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.productForm = this.fb.group({
      selectedProductCategory: [null, Validators.required],
      name: ['', [Validators.required, Validators.minLength(1)]],
      price: [null, [Validators.required, Validators.min(0)]],
      description: [''], // Optional field
    });
  }

  onNewCategoryClick() {
    this.isNewCategoryButtonVisible = !this.isNewCategoryButtonVisible;
  }

  currentStep = 1; // Track the current step

  nextStep() {
    console.log('nextStep');
    console.log(this.productForm.valid);
    console.log(this.productForm);

    if (this.currentStep === 1 && this.productForm.valid) {
      this.currentStep = 2;
    } else {
      this.markFormFieldsTouched();
    }
  }

  markFormFieldsTouched() {
    Object.keys(this.productForm.controls).forEach((field) => {
      const control = this.productForm.get(field);
      if (control) control.markAsTouched();
    });
  }

  isFieldInvalid(field: string) {
    const control = this.productForm.get(field);
    return control?.invalid && (control.dirty || control.touched);
  }

  previousStep() {
    this.currentStep = 1;
  }

  onHide() {
    this.isDialogVisibleChange.emit(false);
    this.currentStep = 1; // Reset to the first step
    this.isNewCategoryButtonVisible = false; // Hide the new category input
    this.newCategoryInput = ''; // Clear the input field
    this.selectedProductCategory = undefined; // Reset the selected category
    this.product = {
      name: '',
      price: null,
      description: '',
    };
  }

  isFirstPageFormValid() {
    return (
      this.selectedProductCategory === undefined ||
      this.product.name === undefined ||
      this.product.name === '' ||
      this.product.price === undefined
    );
  }

  onAddedNewProductProperties() {}

  capitalizeFirstLetterForName(event: Event, fieldName: string): void {
    const inputElement = event.target as HTMLInputElement; // Explicitly cast to HTMLInputElement
    if (inputElement && inputElement.value) {
      const capitalized =
        inputElement.value.charAt(0).toUpperCase() +
        inputElement.value.slice(1);
      this.productForm.get(fieldName)?.setValue(capitalized); // Update the form control value
    }
  }

  // capitalizeFirstLetterForName2(value: string | undefined): void {
  //   if (value && value.length > 0) {
  //     this.product.name = value.charAt(0).toUpperCase() + value.slice(1);
  //   } else {
  //     this.product.name = value; // Handle empty value
  //   }
  // }

  capitalizeFirstLetterForCategory(value: string): void {
    if (value && value.length > 0) {
      this.newCategoryInput = value.charAt(0).toUpperCase() + value.slice(1);
    } else {
      this.newCategoryInput = value; // Handle empty value
    }
  }

  capitalizeFirstLetterForDescription(value: string): void {
    if (value && value.length > 0) {
      this.product.description = value.charAt(0).toUpperCase() + value.slice(1);
    } else {
      this.product.description = value; // Handle empty value
    }
  }
}
