import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  CreateProductPropertiesRequest,
  ProductPropertiesDto,
  ProductPropertyDto,
} from '../../services/models';
import { ProductPropertiesService } from '../../services/services';
import { ContextService } from '../../services/context/context.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-product-add-new-property',
  templateUrl: './new-product-add-new-property.component.html',
  styleUrl: './new-product-add-new-property.component.scss',
})
export class NewProductAddNewPropertyComponent {
  @Input({ required: true })
  productPropertiesList!: ProductPropertiesDto[];
  @Output()
  addedNewProductProperties: EventEmitter<ProductPropertiesDto> =
    new EventEmitter<ProductPropertiesDto>();
  isNewProductPropertiesButtonVisible: boolean = false;
  isProductPropertiesNotUnique: boolean = false;
  newCategoryInput: string = '';
  productPropertyList: ProductPropertyDto[] = [{}];
  productProperties: ProductPropertiesDto = { required: false };
  isCheckbox: boolean = false;

  constructor(
    private productPropertiesService: ProductPropertiesService,
    private contextService: ContextService,
    private toastService: ToastrService
  ) {}

  onNewProductPropertiesClick() {
    this.isNewProductPropertiesButtonVisible =
      !this.isNewProductPropertiesButtonVisible;
  }
  validateUniqueness() {
    this.isProductPropertiesNotUnique = this.productPropertiesList
      .map((el) => el.name)
      .includes(this.productProperties.name);
  }

  onAddNewProperties(productForm: any) {
    const isValid = this.validateForm(productForm);
    if (isValid) {
      this.productProperties.companyId =
        this.contextService.getCompanyId() ?? -999;
      this.productProperties.propertyList = this.productPropertyList;
      const body: CreateProductPropertiesRequest = {
        productProperties: this.productProperties,
      };
      this.productPropertiesService.saveProductProperties({ body }).subscribe({
        next: (response) => {
          // this.addedNewProductProperties.emit(this.productProperties)
          if (response.productProperties) {
            this.resetToDefault();

            this.productPropertiesList.push(response.productProperties);
            this.toastService.success('Nowa grupa została utworzona');
          }
        },
      });
    }
  }

  resetToDefault() {
    this.isNewProductPropertiesButtonVisible = false;
    this.productProperties = {};
    this.productPropertyList = [{}];
  }

  addProperty(): void {
    this.productPropertyList.push({ name: '', price: undefined });
  }

  // Remove a property (called when the "minus" icon is clicked)
  removeProperty(index: number): void {
    this.productPropertyList.splice(index, 1);
  }

  capitalizeFirstLetter() {
    if (this.productProperties.name) {
      this.productProperties.name =
        this.productProperties.name.charAt(0).toUpperCase() +
        this.productProperties.name.slice(1);
    }
  }

  validateForm(productForm: any) {
    productForm.form.markAllAsTouched();

    // Check if the form is valid after marking all controls as touched
    if (productForm.valid && !this.isProductPropertiesNotUnique) {
      return true;
    }
    return false;
  }

  capitalizeFirstLetterInLoop(value: string, index: number): void {
    if (value && value.length > 0) {
      this.productPropertyList[index].name =
        value.charAt(0).toUpperCase() + value.slice(1);
    } else {
      this.productPropertyList[index].name = value; // In case the value is empty
    }
  }
}
