import { trigger, transition, style, animate } from '@angular/animations';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  CreateProductCategoryRequest,
  CreateProductRequest,
  ProductCategoryDto,
  ProductPropertiesDto,
} from '../../services/models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ProductCategoryService,
  ProductService,
} from '../../services/services';
import { ContextService } from '../../services/context/context.service';
import { ToastrService } from 'ngx-toastr';

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
  dialogVisibleChange = new EventEmitter<boolean>();
  isNewCategoryButtonVisible: boolean = false;
  newCategoryInput: string = '';
  selectedProductCategory: ProductCategoryDto | undefined;
  productForm!: FormGroup;
  categoryForm!: FormGroup;
  isProductCategoryNotUnique: boolean = false;
  checkedCheckBoxProductProperties: ProductPropertiesDto[] = [];

  product = {
    name: '',
    price: null,
    description: '',
  };

  constructor(
    private fb: FormBuilder,
    private productCategoryService: ProductCategoryService,
    private contextService: ContextService,
    private toastService: ToastrService,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.productForm = this.fb.group({
      selectedProductCategory: [null, Validators.required],
      name: ['', [Validators.required, Validators.minLength(1)]],
      price: [null, [Validators.required, Validators.min(0)]],
      description: [''], // Optional field
    });
    this.setDefoultCategoryFromValidation();
  }

  setDefoultCategoryFromValidation() {
    this.categoryForm = this.fb.group({
      newCategoryName: [
        '',
        [Validators.required, this.validateNameUniqueness.bind(this)],
      ],
    });
  }

  onNewCategoryClick() {
    this.isNewCategoryButtonVisible = !this.isNewCategoryButtonVisible;
  }

  currentStep = 1; // Track the current step

  nextStep() {
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

  markCategoryFormFieldsTouched() {
    Object.keys(this.categoryForm.controls).forEach((field) => {
      const control = this.categoryForm.get(field);
      if (control) control.markAsTouched();
    });
  }

  isCategoryFieldInvalid(field: string) {
    return (
      (this.categoryForm.get('newCategoryName')?.hasError('required') &&
        this.categoryForm.get('newCategoryName')?.touched) ||
      (this.categoryForm.get('newCategoryName')?.hasError('notUnique') &&
        this.categoryForm.get('newCategoryName')?.touched)
    );
  }

  previousStep() {
    this.currentStep = 1;
  }

  onHide() {
    this.dialogVisibleChange.emit(false);
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

  onChangeCheckedBoxes(event: ProductPropertiesDto[]) {
    this.checkedCheckBoxProductProperties = event;
  }

  capitalizeFirstLetter(event: Event, fieldName: string): void {
    const inputElement = event.target as HTMLInputElement; // Explicitly cast to HTMLInputElement
    if (inputElement && inputElement.value) {
      const capitalized =
        inputElement.value.charAt(0).toUpperCase() +
        inputElement.value.slice(1);
      this.productForm.get(fieldName)?.setValue(capitalized); // Update the form control value
    }
  }

  capitalizeFirstLetterForCategory(event: Event, fieldName: string): void {
    const inputElement = event.target as HTMLInputElement; // Explicitly cast to HTMLInputElement
    if (inputElement && inputElement.value) {
      const capitalized =
        inputElement.value.charAt(0).toUpperCase() +
        inputElement.value.slice(1);
      this.categoryForm.get(fieldName)?.setValue(capitalized); // Update the form control value
    }
  }

  onAddNewCategory() {
    console.log('onAddNewCategory');
    if (this.categoryForm.valid) {
      const productCategory: ProductCategoryDto = {
        name: this.categoryForm.get('newCategoryName')?.getRawValue(),
        companyId: this.contextService.getCompanyId() ?? -999,
      };
      const body: CreateProductCategoryRequest = {
        productCategory: productCategory,
      };

      this.productCategoryService.saveProductCategory({ body }).subscribe({
        next: (response) => {
          if (response.productCategory) {
            this.toastService.success('Nowa kategoria została utworzona');
            this.productCategories.push(response.productCategory);
            this.isNewCategoryButtonVisible = !this.isNewCategoryButtonVisible;
            this.setDefoultCategoryFromValidation();
          }
        },
      });
    } else {
      this.markCategoryFormFieldsTouched();
    }
  }

  validateNameUniqueness(control: any) {
    if (this.productCategories.map((el) => el.name).includes(control.value)) {
      return { notUnique: true }; // Return an error object if invalid
    }
    return null; // Return null if valid
  }

  onCategoryChange(event: any): void {
    this.selectedProductCategory = event.value;
  }

  onCreateNewProduct() {
    const body: CreateProductRequest = {
      product: {
        companyId: this.contextService.getCompanyId() ?? -999,
        name: this.productForm.get('name')?.getRawValue(),
        price: this.productForm.get('price')?.getRawValue(),
        description: this.productForm.get('description')?.getRawValue(),
        productCategory: this.selectedProductCategory,
        productPropertiesList: this.checkedCheckBoxProductProperties,
      },
    };
    this.productService.saveProduct({ body }).subscribe({
      next: () => {
        this.toastService.success('Produkt został utworzony');
        this.isDialogVisible = false
      },
    });
  }
}
