import { trigger, transition, style, animate } from '@angular/animations';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  CreateProductRequest,
  ModifyProductRequest,
  ProductCategoryDto,
  ProductDto,
  ProductPropertiesDto,
} from '../../services/models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
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
  isDialogVisible: boolean = false;
  @Input()
  modifiedProduct: ProductDto | undefined;
  @Output()
  dialogVisibleChange = new EventEmitter<boolean>();
  isNewCategoryButtonVisible: boolean = false;
  newCategoryInput: string = '';
  selectedProductCategory: ProductCategoryDto | undefined;
  productForm!: FormGroup;
  isProductCategoryNotUnique: boolean = false;
  checkedCheckBoxProductProperties: ProductPropertiesDto[] = [];
  currentStep = 1; // Track the current step

  product = {
    name: '',
    price: null,
    description: '',
  };

  constructor(
    private fb: FormBuilder,
    private contextService: ContextService,
    private toastService: ToastrService,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.setDefaultFromValidations();
    console.log('this.modifiedProduct?.productCategory');
    console.log(this.modifiedProduct?.productCategory);
  }

  setDefaultFromValidations() {
    const formName = this.modifiedProduct?.name;
    const formPrice = this.modifiedProduct?.price;
    const formDescription = this.modifiedProduct?.description;
    this.selectedProductCategory = this.modifiedProduct?.productCategory;

    this.productForm = this.fb.group({
      selectedProductCategory: [
        this.selectedProductCategory,
        Validators.required,
      ],
      name: [formName, [Validators.required, Validators.minLength(1)]],
      price: [formPrice, [Validators.required, Validators.min(0)]],
      description: [formDescription], // Optional field
    });
  }


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

  previousStep() {
    this.currentStep = 1;
  }

  onHide() {
    this.resetPropertiesToDefault();
    this.dialogVisibleChange.emit(false);
  }

  resetPropertiesToDefault() {
    this.setDefaultFromValidations();
    this.currentStep = 1; // Reset to the first step
    this.isNewCategoryButtonVisible = false; // Hide the new category input
    this.newCategoryInput = ''; // Clear the input field
    this.selectedProductCategory = undefined; // Reset the selected category
    this.product = {
      name: '',
      price: null,
      description: '',
    };
    this.modifiedProduct = undefined;
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

  onCategoryChange(event: any): void {
    this.selectedProductCategory = event.value;
  }

  onCreateNewProduct() {
    console.log(this.modifiedProduct);
    
    
    if (this.modifiedProduct === undefined) {
      this.createNewProduct();
    } else {
      this.modifyProduct();
    }
  }

  createNewProduct() {
    const body: CreateProductRequest = {
      product: {
        id: this.modifiedProduct?.id,
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
        this.isDialogVisible = false;
        this.dialogVisibleChange.emit(true);
        this.resetPropertiesToDefault();
      },
    });
  }

  modifyProduct() {
    const body: ModifyProductRequest = {
      modifiedId: this.modifiedProduct?.id,
      product: {
        companyId: this.contextService.getCompanyId() ?? -999,
        name: this.productForm.get('name')?.getRawValue(),
        price: this.productForm.get('price')?.getRawValue(),
        description: this.productForm.get('description')?.getRawValue(),
        productCategory: this.selectedProductCategory,
        productPropertiesList: this.checkedCheckBoxProductProperties,
      },
    };
    this.productService.modifyProduct({ body }).subscribe({
      next: () => {
        this.toastService.success('Produkt został zmodyfikowany');
        this.isDialogVisible = false;
        this.dialogVisibleChange.emit(true);
        this.resetPropertiesToDefault();
      },
    });
  }
}
