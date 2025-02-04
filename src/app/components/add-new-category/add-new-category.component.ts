import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreateProductCategoryRequest, ProductCategoryDto } from '../../services/models';
import { ContextService } from '../../services/context/context.service';
import { ProductCategoryService } from '../../services/services';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-new-category',
  templateUrl: './add-new-category.component.html',
  styleUrl: './add-new-category.component.scss',
})
export class AddNewCategoryComponent {
  @Input({ required: true })
  productCategories!: ProductCategoryDto[];
  @Input()
  isNewCategoryButtonVisible: boolean = false; // Hide the new category input
  @Input()
  normalButton: boolean = false
  categoryForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private contextService: ContextService,
    private productCategoryService: ProductCategoryService,
    private toastService: ToastrService
  ) {}

  ngOnInit(){
    this.setDefaultCategoryFromValidations()
  }

  setDefaultCategoryFromValidations() {
    this.categoryForm = this.fb.group({
      newCategoryName: [
        '',
        [Validators.required, this.validateNameUniqueness.bind(this)],
      ],
    });
  }

  validateNameUniqueness(control: any) {
    if (this.productCategories.map((el) => el.name).includes(control.value)) {
      return { notUnique: true }; // Return an error object if invalid
    }
    return null; // Return null if valid
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
            this.isNewCategoryButtonVisible = false;
            this.setDefaultCategoryFromValidations()
          }
        },
      });
    } else {
      this.markCategoryFormFieldsTouched();
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

  onNewCategoryClick() {
    console.log('onNewCategoryClick');
    
    this.isNewCategoryButtonVisible = !this.isNewCategoryButtonVisible;
    console.log(this.isNewCategoryButtonVisible);
  }
}
